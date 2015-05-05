angular.module('pmltq.treebank')
  .factory('treebanksApi', function (_, Restangular, $cacheFactory, $q, svgResult, sticker, localStorageService) {
    var svgCache = $cacheFactory('svg-result-cache');
    var stickerFactory = sticker({defaultCategory: 'Others'});
    var recentStorageKey = 'recently-used-treebanks';

    var restangular = Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setDefaultHttpFields({cache: true});
      RestangularConfigurer.extendModel('treebanks', function (model) {

        var stickers, stickersMap;
        model.getStickers = function() {
          if (stickers) {
            return stickers;
          }

          stickers = [];
          for (var i = this.stickers.length - 1; i >= 0; i--) {
            stickers.push(stickerFactory(this.stickers[i]));
          }

          return stickers;
        };

        model.hasSticker = function(stickerOrName) {
          if (!stickersMap) {
            stickersMap = _.transform(this.getStickers(), function(result, sticker) {
              result[sticker.name] = sticker;
            }, {});
          }

          if (_.isObject(stickerOrName)) {
            stickerOrName = stickerOrName.name;
          }

          return _.has(stickersMap, stickerOrName);
        };

        model.loadSvg = function (node, tree) {
          var deferred = $q.defer();
          var key = [this.id, node, tree].join(':');
          var cachedSvg = svgCache.get(key);
          if (cachedSvg) {
            deferred.resolve(cachedSvg);
          } else {
            this.post('svg', {
              nodes: [node],
              tree: tree
            }).then(function(svg) {
              svg = svgResult(svg);
              svgCache.put(key, svg);
              deferred.resolve(svg);
            }, deferred.reject);
          }

          return deferred.promise;
        };
        return model;
      });
    });

    var service = restangular.service('treebanks');

    service.recentlyUsed = function () {
      var recent = localStorageService.get(recentStorageKey) || [];
      return service.getList().then(function(list) {
        var tbIndex = _.indexBy(list, 'id'), result = [];

        for (var i = 0; i < recent.length; i++) {
          var tbId = recent[i];
          if (tbIndex[tbId]) {
            result.push(tbIndex[tbId]);
          }
        }

        return result;
      });
    };

    service.addRecentlyUsed = function (tbId) {
      var recent = localStorageService.get(recentStorageKey) || [];
      recent.unshift(tbId);
      localStorageService.set(recentStorageKey, _.uniq(recent));
    };

    return service;
  });
