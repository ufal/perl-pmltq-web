module.exports = function(treebank, queryParams, treebankApi) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  vm.history = [];
  vm.queryParams = queryParams;

  treebankApi.addRecentlyUsed(treebank.id);
};
