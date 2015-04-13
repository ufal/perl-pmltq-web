angular.module('pmltq.home', ['pmltq.shared', 'pmltq.treebank']);

angular.module('pmltq.home').config(function($stateProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html'
  });
});
