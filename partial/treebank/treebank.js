angular.module('pmltqWeb').controller('TreebankController',function($scope, $stateParams, treebanksApi) {
  $scope.state = 'loading';

  treebanksApi.one($stateParams.treebank).get().then(function(treebank) {
    $scope.treebank = treebank;
    $scope.state = 'success';
  }, function(response) {
    $scope.state = 'error';
  });
});
