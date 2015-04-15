angular.module('pmltq.treebank').factory('treebanksApi', function (Restangular, $cacheFactory, $q, svgParser, sticker) {
  var svgCache = $cacheFactory('svg-result-cache');
  var stickerFactory = sticker({defaultCategory: 'Others'});

  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
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
            svg = svgParser(svg);
            svgCache.put(key, svg);
            deferred.resolve(svg);
          }, deferred.reject);
        }

        return deferred.promise;
      };
      return model;
    });
  });
  return restangular.service('treebanks');
});
