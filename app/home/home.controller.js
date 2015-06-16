angular.module('pmltq.home').controller('HomeController', function($scope, recentlyUsed, treebanks, _) {
  var vm = this;

  vm.featured = _.take(treebanks, 5);
  vm.recentlyUsed = _.take(recentlyUsed, 5);
});
