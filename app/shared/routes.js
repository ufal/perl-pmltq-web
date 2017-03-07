module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  $stateProvider.state('error', {
    template: require('./error-page/template.jade'),
    controller: require('./error-page'),
    controllerAs: 'vm',
    params: {
      status: 500,
      message: 'Internal Server Error',
      response: ''
    }
  });
};
