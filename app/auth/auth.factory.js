/* @ngInject */
function AuthService($rootScope, authService, authApi) {
  var auth = this,
    loggedIn = false;

  $rootScope.$on('event:auth-loginConfirmed', function () {
    loggedIn = true;
  });

  auth.ping = function () {
    return authApi.get().then(function (authData) {
      if (authData.user === false) {
        loggedIn = false;
      } else {
        authService.loginConfirmed(authData.user);
      }
    }, function () {
      loggedIn = false;
    });
  };

  auth.loggedIn = function () {
    return loggedIn;
  };

  auth.login = function (params) {
    return authApi.post(params).then(function (authData) {
      authService.loginConfirmed(authData.user);
    });
  };

  auth.logout = function () {
    return authApi.delete().then(function () {
      loggedIn = false;
      $rootScope.$broadcast('event:auth-loggedOut');
    });
  };
}

angular
  .module('pmltq.auth')
  .service('Auth', AuthService);
