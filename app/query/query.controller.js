angular.module('pmltq.query').controller('QueryController', function($scope, treebank, result, queryParams) {
  $scope.treebank = treebank;
  $scope.queryParams = queryParams;

  if (queryParams.execute) {
    queryParams.execute = false;
    result.submit(treebank, queryParams);
  }
});
