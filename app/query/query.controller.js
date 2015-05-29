angular.module('pmltq.query').controller('QueryController', function($scope, treebank, queryParams) {
  $scope.treebank = treebank;
  $scope.queryParams = queryParams;
});
