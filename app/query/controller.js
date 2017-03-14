module.exports = function($stateParams, $state, treebank, queryParams) {
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  vm.queryParams = queryParams;

  vm.showResult = function () {
    $state.go('treebank.query.result.index', {query: queryParams.query, filter: queryParams.filter, timeout: queryParams.timeout, limit: queryParams.limit});
  };

  if ($stateParams.timeout) {
    queryParams.timeout =$stateParams.timeout;
  }

  if ($stateParams.limit) {
    queryParams.limit = $stateParams.limit;
  }

  if ($stateParams.query) {
    queryParams.text($stateParams.query);
  }
};
