angular.module('pmltq.query').config(function($stateProvider) {

  $stateProvider.state('treebank.query', {
    url: '/query/:query',
    templateUrl: 'query/query.html',
    controller: 'QueryController',
    abstract: true
  });

  $stateProvider.state('treebank.query.index', {
    url: ''
  });
});
