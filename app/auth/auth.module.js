angular.module('pmltq.auth', ['http-auth-interceptor', 'restangular', 'semanticUI']);

angular.module('pmltq.auth').run(function($rootScope, authService, loginModal) {
  $rootScope.$on('event:auth-loginRequired', function(e, response) {
    var m = loginModal(response);
    m.promise.then(function () {
      m.show();
    });
  });
});
