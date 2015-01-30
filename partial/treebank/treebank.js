angular.module('pmltqWeb').controller('TreebankCtrl',function($scope, $stateParams, treebanks){
  var treebankName = $stateParams.treebank,
  tb = treebanks.getByName(treebankName);

  $scope.treebank = tb;
  console.log(tb);
});
