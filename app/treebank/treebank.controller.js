angular.module('pmltq.treebank')
  .controller('TreebankController', function($scope, result, treebank, history, queryParams, treebankApi) {
    $scope.treebank = treebank;
    $scope.history = history;
    $scope.result = result;
    treebankApi.addRecentlyUsed(treebank.id);

    $scope.queryParams = queryParams;
  });
