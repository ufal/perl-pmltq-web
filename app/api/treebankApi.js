var _ = require('lodash');

module.exports = function (Restangular, treebankModelFactory, treebankCollectionFactory, localStorageService) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var recentStorageKey = 'recently-used-treebanks';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHttpFields({cache: true});
    RestangularConfigurer.extendModel('treebanks', function (model) {
      return treebankModelFactory(model);
    });

    RestangularConfigurer.extendCollection('treebanks', function (collection) {
      return treebankCollectionFactory(collection);
    });
  });

  var service = restangular.service('treebanks');

  //var list, getList = _.bind(service.getList, service);
  //
  //service.getList = function () {
  //  return list ? list : list = getList();
  //};

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
};
