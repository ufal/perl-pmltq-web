module.exports = function($scope, result, treebank) {
  'ngInject';
  var vm = this;

  vm.result = result;
  vm.type = result.type;
};
