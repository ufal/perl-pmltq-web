angular.module('pmltq.treebank').controller('BrowseTreebanksController', function(treebanksFilter, treebanksList) {
  var vm = this;

  vm.treebanks = treebanksList;
  vm.noTreebanks = !treebanksList || treebanksList.length === 0;
  vm.filter = treebanksFilter('browse-treebanks', treebanksList);
});
