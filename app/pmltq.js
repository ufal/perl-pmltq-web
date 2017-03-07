// global jQuery for Angular
global.jQuery = require('jquery');
var angular = require('angular');

if (!LINDAT) {
  // Use dummy module
  angular.module('lindat', []);
} else {
  if (DEVELOPMENT) {
    // In production we will get lindat-common directly from lindat servers, see index.jade
    require('lindat-common');
  }
}

require('babel-polyfill');
require('./pmltq.less');

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
    //noinspection BadExpressionStatementJS
    'ngInject';

    $urlMatcherFactoryProvider.strictMode(true);
    $locationProvider.hashPrefix('!');
    RestangularProvider.setBaseUrl(apiBaseUrl);
    $urlRouterProvider.otherwise('/home');
  });

if (LINDAT) {
  angular.module('pmltq').run(function ($rootScope, $location, Piwik) {
    //noinspection BadExpressionStatementJS
    'ngInject';

    $rootScope.$on('$stateChangeSuccess', function () {
      Piwik.setCustomUrl($location.absUrl());
      Piwik.trackPageView();
    });
  });
}

angular.module('pmltq').run(function (Auth, $state, $interval, $window, $location, $rootScope, cfpLoadingBar) {
  'ngInject';

  Auth.ping();

  if (PRODUCTION) {
    $interval(() => {
      Auth.ping();
    }, 60000, 0, false); // Ping server every 60 seconds to keep session alive
  }

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
