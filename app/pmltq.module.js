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

angular.module('pmltq').config(function(
  $locationProvider,
  $urlRouterProvider,
  RestangularProvider
) {

  $locationProvider.hashPrefix('!');
  RestangularProvider.setBaseUrl('/api');

  $urlRouterProvider.otherwise('/home');
});

angular.module('pmltq').run(function(Auth, $state, $window, $rootScope, cfpLoadingBar) {
  Auth.ping();

  $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, res) {
    cfpLoadingBar.complete();
    if (res.status === 401) {
      // Failed login
      if (fromState && !fromState.abstract) {
        $state.go(fromState, fromParams); // Go back to previous state
      } else {
        $state.go('home'); // Go home
      }
    } else if (toState.name !== 'error') {
      $state.go('error', {status: res.status, message: res.statusText, response: res.data});
      e.preventDefault();
    } else {
      e.preventDefault();
    }
  });
});
