module.exports = function($stateParams, $state, treebank, queryParams, queryFileParams) {
  'ngInject';
  var vm = this;
  vm.treebank = treebank;
  vm.queryParams = queryParams;
  vm.queryFileParams = queryFileParams;

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
    queryParams.query = $stateParams.query;
  }

  if ($stateParams.fileID) {
    queryFileParams.fileID = $stateParams.fileID;
    if ($stateParams.queryID) {
      queryFileParams.queryID = $stateParams.queryID;
    }
  }

};
