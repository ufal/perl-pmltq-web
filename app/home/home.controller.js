angular.module('pmltq.home').controller('HomeController', function($scope, treebanks, _) {
  $scope.featured = _.sample(treebanks, 5);
  $scope.recentlyUsed = _.sample(treebanks, 3);
});
