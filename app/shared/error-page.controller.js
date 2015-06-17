/* @ngInject */
function ErrorPageController($stateParams, $sce) {
  var vm = this;

  vm.status = $stateParams.status || '500';
  vm.message = $stateParams.message || 'Internal Server Error';
  vm.response = $stateParams.response;
  if (vm.response) {
    if (!angular.isString(vm.response)) {
      if (vm.response.error) {
        vm.response = vm.response.error;
      } else {
        vm.response = vm.response + ''; // to string
      }
    }
    vm.response = $sce.trustAsHtml(vm.response);
  }
}

angular
  .module('pmltq.shared')
  .controller('ErrorPageController', ErrorPageController);
