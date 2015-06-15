/* @ngInject */
function AuthService($rootScope, authService, Restangular) {
  var auth = this,
    loggedIn = false,
    authApi = Restangular.service('auth');

  $rootScope.$on('event:auth-loginConfirmed', function () {
    loggedIn = true;
  });

  auth.ping = function () {
    return authApi.one().get().then(function (authData) {
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
    return authApi.post({auth: {username: params.username, password: params.password}}).then(function (authData) {
      authService.loginConfirmed(authData.user);
      return authData.user;
    });
  };

  auth.logout = function () {
    return authApi.one().remove().then(function () {
      loggedIn = false;
      $rootScope.$broadcast('event:auth-loggedOut');
    });
  };
}

angular
  .module('pmltq.auth')
  .service('Auth', AuthService);
