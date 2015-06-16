/* @ngInject */
function AuthService($rootScope, authService, Restangular) {
  var auth = this,
    authApi = Restangular.service('auth');

  auth.loggedIn = false;
  auth.user = {};

  $rootScope.$on('event:auth-loginConfirmed', function () {
    auth.loggedIn = true;
  });

  auth.ping = function () {
    return authApi.one().get().then(function (authData) {
      if (authData.user === false) {
        auth.loggedIn = false;
      } else {
        auth.user = authData.user;
        authService.loginConfirmed(auth.user);
      }
    }, function () {
      auth.loggedIn = false;
      auth.user = {};
    });
  };

  auth.login = function (params) {
    return authApi.post({auth: {username: params.username, password: params.password}}).then(function (authData) {
      auth.user = authData.user;
      authService.loginConfirmed(auth.user);
      return auth.user;
    });
  };

  auth.logout = function () {
    return authApi.one().remove().then(function () {
      auth.loggedIn = false;
      auth.user = {};
      $rootScope.$broadcast('event:auth-loggedOut');
    });
  };
}

angular
  .module('pmltq.auth')
  .service('Auth', AuthService);
