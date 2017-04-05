module.exports = function(treebank, queryParams, queryFileParams, treebankApi) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  //vm.history = []; // TODO fix this
  vm.queryFileParams = queryFileParams;
  vm.queryParams = queryParams;

  treebankApi.addRecentlyUsed(treebank.id);
};
