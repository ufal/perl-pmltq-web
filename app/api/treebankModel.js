var _ = require('lodash');

var ErrorResult = require('./result/error');
var SvgResult = require('./result/svg');
var TableResult = require('./result/table');

module.exports = function treebankModelFactory($q, $cacheFactory, tredSvg, Suggest, Auth) {
  'ngInject';

  var svgCache = $cacheFactory('svg-result-cache', {capacity: 10});
  return function treebankModel(model) {
    function predicate(collectionName) {
      var map;
      return function (objectOrId) {
        if (!map) {
          map = _.indexBy(this[collectionName], 'name');
        }

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

    model.queryResult = function (params) {
      return this.post('query', params).then((data) => {
        const resultData = data.results,
          nodes = data.nodes;

        if (resultData.length === 0) {
          return new ErrorResult(this, 'Result is empty. No nodes are matching the query.');
        }

        if (nodes) {
          return new SvgResult(this, nodes, resultData);
        }
        return new TableResult(this, resultData);
      }, (response) => {
        return new ErrorResult(this, response.data.error || 'Error while executing query.');
      });
    };

    model.suggest = function (basedOn) {
      if (!_.isArray(basedOn)) {
        basedOn = [basedOn];
      }
      return this.post('suggest', {ids: basedOn}).then((data) => {
        return new Suggest(data.query);
      });
    };

    model.loadSvgFile = function (address, tree) {
      //var deferred = $q.defer();
      //var key = [this.id, address, tree].join(':');
      //var cachedSvg = svgCache.get(key);
      //if (cachedSvg) {
      //  //cachedSvg.reattachEvents();
      //  deferred.resolve(cachedSvg);
      //} else {
      return this.post('svg', {
        nodes: [address],
        tree: tree
      }).then((svg) => {
        svg = tredSvg(this, address, svg);
        return svg;
        //svgCache.put(key, svg);
        //var currentTree = svg.currentTree();
        //if (currentTree !== tree) {
        //  key = [this.id, node, currentTree].join(':');
        //  svgCache.put(key, svg);
        //}
        //deferred.resolve(svg);
      });
      //}, deferred.reject);
      //}

      //return deferred.promise;
    };

    // TODO: rewrite to change to file not address
    model.loadSvgTree = function (address, tree) {
      return this.post('svg', {
        nodes: [address],
        tree: tree
      });
    };

    return model;
  };
};
