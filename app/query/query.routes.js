angular.module('pmltq.query').config(function($stateProvider) {

  $stateProvider.state('treebank.query', {
    url: '/query/:query',
    templateUrl: 'query/query.html'
  });

  $stateProvider.state('treebank.query.index', {
    url: '',
    controller: 'QueryController'
  });
});
