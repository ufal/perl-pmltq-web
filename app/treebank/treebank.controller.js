angular.module('pmltq.treebank').controller('TreebankController', function($scope, $state, resultHolder, treebank, history) {
  $scope.treebank = treebank;
  $scope.history = history;
  $scope.result = resultHolder();
  $scope.queryParams = {
    timeout: 30,
    limit: 100,
    query: "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];"
  };
});
