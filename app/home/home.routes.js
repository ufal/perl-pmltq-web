angular.module('pmltq.home').config(function($stateProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
    controller: 'HomeController',
    resolve: /*@ngInject*/ {
      treebanks: function(treebanksApi) {
        return treebanksApi.getList();
      }
    }
  });
});
