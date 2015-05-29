angular.module('pmltq.help').config(function($stateProvider) {

  $stateProvider.state('treebank.help', {
    url: '/help',
    templateUrl: 'help/help.html',
    controller: 'HelpController',
    controllerAs: 'vm'
  });

});
