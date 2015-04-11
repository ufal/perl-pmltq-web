angular.module('pmltq.history', ['pmltq.shared']);

angular.module('pmltq.history').config(function($stateProvider) {

  $stateProvider.state('treebank.history', {
    url: '/history',
    templateUrl: 'history/history.html'
  });

});
