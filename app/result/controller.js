module.exports = function($scope, result) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  var vm = this;

  vm.result = result;
  vm.type = result.type;
};
