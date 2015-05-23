angular.module('pmltq.treebank')
  .controller('TreebankController', function($scope, result, treebank, history, treebanksApi) {
    $scope.treebank = treebank;
    $scope.history = history;
    $scope.result = result;
    treebanksApi.addRecentlyUsed(treebank.id);

    $scope.queryParams = {
      timeout: 30,
      limit: 100,
      query: "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];"
    };
  });
