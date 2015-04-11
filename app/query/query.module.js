angular.module('pmltq.query', ['pmltq.shared']);

angular.module('pmltq.query').config(function($stateProvider) {

  $stateProvider.state('treebank.query', {
    url: '/query/:query',
    templateUrl: 'query/query.html'
  });
});
