module.exports = function TutorialController($stateParams, $scope, $state, treebank, publicFileApi) { // TODO add query file and user !!!
  'ngInject';

  var vm = this;
  publicFileApi.one($stateParams.userID).get({'file': $stateParams.fileID}).then(file => {this.file = file;});
console.log("STATEPARAMS", $stateParams, vm.file);
  vm.treebank = treebank;
};
