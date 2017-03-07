/**
 * @param {angular.ui.IStateProvider} $stateProvider
 */
module.exports = function ($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('treebank.query.result', {
    url: '/result',
    template: '<div ui-view=""></div>',
    abstract: true,
    resolve : {
      result: function (treebank, queryParams) {
        return treebank.queryResult(queryParams.params()).then((result) => {
          queryParams.result = result;
          return result;
        });
      }
    }
  });

  $stateProvider.state('treebank.query.result.index', {
    url: '',
    onEnter: function ($state, $stateParams, $timeout, result) {
      $timeout(function () {
        $state.go('^.' + result.type, $stateParams, {location: 'replace'});
      });
    }
  });

  $stateProvider.state('treebank.query.result.error', {
    url: '',
    template: require('./error/index.jade'),
    controller: require('./error/controller'),
    controllerAs: 'vm'
  });

  $stateProvider.state('treebank.query.result.svg', {
    url: '/svg',
    template: require('./svg/index.jade'),
    controller: require('./svg/controller'),
    controllerAs: 'vm'
  });

  $stateProvider.state('treebank.query.result.table', {
    url: '/table',
    template: require('./table/index.jade'),
    controller: require('./table/controller'),
    controllerAs: 'vm'
  });
};
