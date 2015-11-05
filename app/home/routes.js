module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('home', {
    url: '/home',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    resolve: /*@ngInject*/ {
      treebanks: function(treebankApi) {
        return treebankApi.getList();
      },
      recentlyUsed: function(treebankApi) {
        return treebankApi.recentlyUsed();
      }
    }
  });
};
