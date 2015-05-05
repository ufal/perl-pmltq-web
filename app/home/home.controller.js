angular.module('pmltq.home').controller('HomeController', function($scope, recentlyUsed, treebanks, _) {
  $scope.featured = _.take(treebanks, 5);
  $scope.recentlyUsed = _.take(recentlyUsed, 3);
});
