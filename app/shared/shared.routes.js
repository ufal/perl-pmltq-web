angular.module('pmltq.shared').config(function($stateProvider) {

  $stateProvider.state('error', {
    templateUrl: 'shared/error-page.html',
    controller: 'ErrorPageController',
    controllerAs: 'vm',
    params: {
      status: 500,
      message: 'Internal Server Error',
      response: ''
    }
  });
});
