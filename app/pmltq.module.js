angular.module('pmltq', [
  'pmltq.shared',

  // modules
  'pmltq.auth',
  'pmltq.help',
  'pmltq.history',
  'pmltq.home',
  'pmltq.query',
  'pmltq.result',
  'pmltq.treebank'
]);

angular.module('pmltq').config(function($stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

  $locationProvider.hashPrefix('!');
  RestangularProvider.setBaseUrl('/api');

  $urlRouterProvider.otherwise('/home');
});

angular.module('pmltq').run(function(Auth) {
  Auth.ping();
});
