angular.module('pmltqWeb').controller('HomeCtrl',function($scope, treebanks) {
  var example_data = treebanks.getList();
  $scope.featured = _.sample(example_data, 5);
  $scope.recentlyUsed = _.sample(example_data, 2);
});
