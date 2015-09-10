angular.module('pmltq.query').controller('QueryController', function($scope, treebank, result, queryParams) {
  $scope.treebank = treebank;
  $scope.queryParams = queryParams;

  if (queryParams.execute) {
    queryParams.execute = false;
    queryParams.filter = true;
    result.submit(treebank, queryParams);
  }
});
