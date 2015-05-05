angular.module('pmltq.treebank')
  .controller('TreebankController', function($scope, resultHolder, treebank, history, treebanksApi) {
    $scope.treebank = treebank;
    $scope.history = history;
    $scope.result = resultHolder();
    treebanksApi.addRecentlyUsed(treebank.id);

    $scope.queryParams = {
      timeout: 30,
      limit: 100,
      query: "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];"
    };
  });
