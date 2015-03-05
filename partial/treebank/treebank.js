angular.module('pmltqWeb').controller('TreebankCtrl',function($scope, $stateParams, treebanks){
  treebanks.one($stateParams.treebank).get().then(function(tb) {
    $scope.treebank = tb;
  });
});
