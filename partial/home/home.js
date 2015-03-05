angular.module('pmltqWeb').controller('HomeCtrl',function($scope, treebanks) {
  treebanks.getList().then(function(data) {
    $scope.featured = _.sample(data, 5);
    $scope.recentlyUsed = _.sample(data, 2);
  });
});
