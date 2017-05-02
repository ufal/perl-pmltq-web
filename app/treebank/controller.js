module.exports = function(treebank, queryParams, queryFileParams, treebankApi, publicFileTreeApi) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  //vm.history = []; // TODO fix this
  vm.queryFileParams = queryFileParams;
  vm.queryParams = queryParams;

  publicFileTreeApi.getList().then(lists => {this.publicLists = lists});
  treebankApi.addRecentlyUsed(treebank.id);
};
