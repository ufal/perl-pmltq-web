var $ = global.$ = global.jQuery = require('jquery');
var angular = require('angular');

if (!LINDAT) {
  angular.module('lindat', []);
} else {
  require('lindat-common');
}

var pmltqModule = angular.module('pmltq', [
  require('./shared'),
  require('./auth'),
  require('./home'),
  require('./treebank'),
  require('./browse'),
  require('./query'),
  'lindat'
]);

require('./config')(pmltqModule);

angular.module('pmltq').config(
  function (apiBaseUrl,
            $locationProvider,
            $urlRouterProvider,
            $urlMatcherFactoryProvider,
            RestangularProvider) {
    'ngInject';

    $urlMatcherFactoryProvider.strictMode(true);
    $locationProvider.hashPrefix('!');
    RestangularProvider.setBaseUrl(apiBaseUrl);
    $urlRouterProvider.otherwise('/home');
  });

if (LINDAT) {
  angular.module('pmltq').run(function ($rootScope, $location, Piwik) {
    'ngInject';

    $rootScope.$on('$stateChangeSuccess', function () {
      Piwik.setCustomUrl($location.absUrl());
      Piwik.trackPageView();
    });
  });
}

angular.module('pmltq').run(function (Auth, $state, $window, $location, $rootScope, cfpLoadingBar) {
  'ngInject';

  Auth.ping();

  $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, res) {
    cfpLoadingBar.complete();
    if (res instanceof Error) {
      console.error(res);
      $state.go('error', {status: 500, message: 'Internal Application Error', response: res.toString()});
      e.preventDefault();
    } else if (res.status === 401) {
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
