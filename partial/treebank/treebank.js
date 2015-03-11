angular.module('pmltqWeb').controller('TreebankCtrl',function($scope, $stateParams, treebanks) {
  $scope.state = 'loading';

  treebanks.one($stateParams.treebank).get().then(function(tb) {
    $scope.treebank = tb;
    $scope.state = 'success';
  }, function(response) {
    $scope.state = 'error';
  });
});
