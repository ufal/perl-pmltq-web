angular.module('pmltq.help', ['pmltq.shared']);

angular.module('pmltq.help').config(function($stateProvider) {

  $stateProvider.state('treebank.help', {
    url: '/help',
    templateUrl: 'help/help.html'
  });

});

