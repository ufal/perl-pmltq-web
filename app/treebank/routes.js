/**
 * @param {angular.ui.IStateProvider} $stateProvider
 */
module.exports = function ($stateProvider) {
  //noinspection BadExpressionStatementJS
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
      queryParams: function ($stateParams, QueryParams) {
        var query = new QueryParams($stateParams.treebankId);
        query.restore();
        return query;
      }
    }
  });

  $stateProvider.state('treebank.index', {
    url: '',
    onEnter: function ($state, $stateParams, queryParams, $timeout) {
      $timeout(function () {
        if (!queryParams.query) {
          $state.go('^.help', {}, {location: 'replace'});
        } else {
          $state.go('^.query.index', {query: queryParams.query}, {location: 'replace'});
        }
      });
    }
  });
};
