angular.module('pmltqWeb').controller('HomeController',function($scope, treebanksApi) {
  treebanksApi.getList().then(function(data) {
    $scope.featured = _.sample(data, 5);
    $scope.recentlyUsed = _.sample(data, 2);
  });
});
