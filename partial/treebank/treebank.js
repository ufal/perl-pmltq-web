angular.module('pmltqWeb').controller('TreebankController',function($scope, $stateParams, treebanksApi) {
  $scope.state = 'loading';

  treebanksApi.one($stateParams.treebank).get().then(function(tb) {
    $scope.treebank = tb;
    $scope.state = 'success';
  }, function(response) {
    $scope.state = 'error';
  });
});
