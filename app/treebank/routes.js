/**
 * @param {angular.ui.IStateProvider} $stateProvider
 */
module.exports = function ($stateProvider) {
  'ngInject';

  $stateProvider.state('treebank', {
    url: '/treebank/{treebankId}',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    title: '{{treebank.title}}',
    abstract: true,
    resolve: {
      treebank: function (treebankApi, $stateParams) {
        return treebankApi.one($stateParams.treebankId).get();
      },
      history: function (historyApi) {
        return [];
      },
      queryParams: function ($stateParams, QueryParams) {
        var query = new QueryParams($stateParams.treebankId);
        query.restore();
        return query;
      },
      queryFileParams: function ($stateParams, QueryFileParams) {
        var queryFile = new QueryFileParams($stateParams.treebankId);
        queryFile.restore();
        return queryFile;
      }
    }
  });

  //noinspection JSUnusedGlobalSymbols
  $stateProvider.state('treebank.index', {
    url: '',
    onEnter: function ($state, $stateParams, $timeout, history) {
      $timeout(function () {
        if (history.length === 0) {
          $state.go('^.help', $stateParams, {location: 'replace'});
        } else {
          $state.go('^.query.index', $stateParams, {location: 'replace'});
        }
      });
    }
  });
};
