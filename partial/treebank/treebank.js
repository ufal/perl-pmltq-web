angular.module('pmltqWeb').controller('TreebankController', function($scope, $stateParams, resultHolder, offCanvas, treebanksApi) {
  $scope.state = 'loading';
  $scope.result = resultHolder();
  $scope.queryParams = {
    timeout: 30,
    limit: 100,
    query: "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];"
  };

  treebanksApi.one($stateParams.treebank).get().then(function(treebank) {
    $scope.treebank = treebank;
    $scope.state = 'success';
  }, function(response) {
    $scope.state = 'error';
  });
});
