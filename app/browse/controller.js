require('./index.less');

module.exports = function BrowseTreebanksController(treebanksFilter, treebanksList) {
  'ngInject';

  var vm = this;

  vm.treebanks = treebanksList;
  vm.noTreebanks = !treebanksList || treebanksList.length === 0;
  vm.filter = treebanksFilter('browse-treebanks', treebanksList);
};
