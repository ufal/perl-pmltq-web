angular.module('pmltq.treebank').factory('treebanksApi', function (Restangular, $cacheFactory, $q, svgParser) {
  var svgCache = $cacheFactory('svg-result-cache');

  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.extendModel('treebanks', function (model) {
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
