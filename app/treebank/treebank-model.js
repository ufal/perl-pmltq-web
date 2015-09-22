function treebankModelFactory($q, $cacheFactory, svgResult, Auth, _) {
  var svgCache = $cacheFactory('svg-result-cache');
  return function treebankModel (model) {
    function predicate(collectionName) {
      var map;
      return function (objectOrId) {
        if (!map) { map = _.indexBy(this[collectionName], 'name'); }

        if (_.isObject(objectOrId)) {
          objectOrId = objectOrId.name;
        }

        return _.has(map, objectOrId);
      };
    }

    model.hasTag = predicate('tags');
    model.hasLanguage = predicate('languages');

    model.accessible = function () {
      if (this.isFree) {
        return true;
      }

      if (Auth.loggedIn) {
        if (Auth.user.accessAll || Auth.user.availableTreebanks[this.id]) {
          return true;
        }
      }

      return false;
    };

    model.loadSvg = function (node, tree) {
      var deferred = $q.defer();
      var key = [this.id, node, tree].join(':');
      var cachedSvg = svgCache.get(key);
      if (cachedSvg) {
        cachedSvg.restore();
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
  };
}

angular.module('pmltq.treebank')
  .factory('treebankModelFactory', treebankModelFactory);
