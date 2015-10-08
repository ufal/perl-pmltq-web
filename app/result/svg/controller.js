module.exports = function ($scope, result, queryParams) {
  'ngInject';
  var vm = this;

  vm.result = result;
  vm.queryParams = queryParams;
  vm.treebank = result.treebank;

  var s1 = result.nodeAddress
    .subscribe((val) => vm.nodeAddress = val);

  var s2 = result.currentResult
    .subscribe((val) => vm.currentResult = val);

  // Not sure how to do it better
  $scope.$on('destroy', function () {
    s1.dispose();
    s2.dispose();
  });
};
