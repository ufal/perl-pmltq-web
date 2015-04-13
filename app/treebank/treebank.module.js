angular.module('pmltq.treebank', ['pmltq.shared', 'pmltq.history', 'pmltq.query', 'pmltq.result', 'pmltq.help']);

angular.module('pmltq.treebank').config(function($stateProvider) {

  $stateProvider.state('treebank', {
    url: '/treebank/:treebankId',
    templateUrl: 'treebank/treebank.html',
    controller: 'TreebankController',
    abstract: true,
    resolve: {
      treebank: ['treebanksApi', '$stateParams', function(treebanksApi, $stateParams) {
        return treebanksApi.one($stateParams.treebankId).get();
      }],
      history: ['historyApi', function(historyApi) {
        return historyApi.getList();
      }]
    }
  });

  $stateProvider.state('treebank.index', {
    url: '',
    controller: ['$state', 'history', function($state, history) {
      if (history.length === 0) {
        $state.go('treebank.help');
      } else {
        $state.go('treebank.query.index');
      }
    }]
  });

  $stateProvider.state('browse', {
    url: '/treebanks',
    templateUrl: 'treebank/browse.html'
  });
});

