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

angular.module('pmltq').run(function(Auth, $state, $rootScope, cfpLoadingBar) {
  Auth.ping();

  $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams) {
    cfpLoadingBar.complete();
    if (fromState && !fromState.abstract) {
      $state.go(fromState, fromParams);
    } else {
      $state.go('home');
    }
  });
});
