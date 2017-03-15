var angular = require('angular');

require('angular-http-auth');
require('restangular');

module.exports = angular.module('pmltq.auth', ['http-auth-interceptor', 'restangular', require('../semantic-ui')])
  .run(($rootScope, authService, loginModal) => {
    'ngInject';

    $rootScope.$on('event:auth-loginRequired', function(e, response) {
      var m = loginModal(response);
      m.show();
    });
  })
  .service('Auth', require('./auth'))
  .constant('discojuiceUrl', '')
  .factory('Discojuice', require('./discojuice.js'))
  .factory('loginModal', require('./login-modal'))
  .directive({
    login: require('./directives/login.js'),
    logout: require('./directives/logout.js')
  })
  .name;

