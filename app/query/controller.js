/** @type _ */
var _ = require('lodash');

module.exports = function($stateParams, $state, treebank, queryParams) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var vm = this;

  vm.treebank = treebank;
  vm.queryParams = queryParams;

  vm.showResult = function () {
    $state.go('treebank.query.result.index', {query: queryParams.query});
  };

  queryParams.query = $stateParams.query;
};
