module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('browse', {
    url: '/treebanks',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    title: 'Browse Treebanks',
    resolve: {
      treebanksList: function(treebankApi) {
        return treebankApi.getList();
      }
    }
  });
};
