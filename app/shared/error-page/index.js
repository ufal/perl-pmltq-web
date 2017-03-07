var _ = require('lodash');
module.exports = function ErrorPageController($stateParams, $sce) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var vm = this;

  vm.status = $stateParams.status || '500';
  vm.message = $stateParams.message || 'Internal Server Error';
  vm.response = $stateParams.response;
  if (vm.response) {
    if (!_.isString(vm.response)) {
      if (vm.response.error) {
        vm.response = vm.response.error;
      } else {
        vm.response = vm.response + ''; // to string
      }
    }
    vm.response = $sce.trustAsHtml(vm.response);
  }
};
