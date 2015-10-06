angular.module('pmltq.home').config(function($stateProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
    controller: 'HomeController',
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
});
