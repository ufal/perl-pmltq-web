module.exports = function($stateParams, $state, treebank, queryParams) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  vm.queryParams = queryParams;

  vm.showResult = function () {
    $state.go('treebank.query.result.index', {query: queryParams.query});
  };

  if ($stateParams.query) {
    queryParams.text($stateParams.query);
  }
};
