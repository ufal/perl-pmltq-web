angular.module('pmltq.treebank')
  .controller('TreebankController', function($scope, result, treebank, history, queryParams, treebanksApi) {
    $scope.treebank = treebank;
    $scope.history = history;
    $scope.result = result;
    treebanksApi.addRecentlyUsed(treebank.id);

    $scope.queryParams = queryParams;
  });
