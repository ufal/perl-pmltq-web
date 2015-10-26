module.exports = function(treebank, history, queryParams, treebankApi) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  vm.history = history;
  vm.queryParams = queryParams;

  treebankApi.addRecentlyUsed(treebank.id);
};
