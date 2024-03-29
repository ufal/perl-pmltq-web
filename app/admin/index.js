require('angular-http-auth');
require('./index.less');

var pmltqAdmin = angular.module('pmltqAdmin', ['ng-admin', 'http-auth-interceptor']);

// custom API flavor
var api = require('./api');
pmltqAdmin.config(['RestangularProvider', api.requestInterceptor]);
pmltqAdmin.config(['RestangularProvider', api.responseInterceptor]);

require('./filters')(pmltqAdmin);

pmltqAdmin.config(['NgAdminConfigurationProvider', 'RestangularProvider', function (nga, rp) {

  // create the admin application
  var admin = nga.application('PML-TQ Server Administration');

  if (DEVELOPMENT) {
    rp.setBaseUrl('/api');
    admin.baseApiUrl('/api/admin/');
  }

  if (PRODUCTION) {
    rp.setBaseUrl(BASEAPI);
    admin.baseApiUrl(BASEAPI+'/admin/');
  }

  // add entities
  admin.addEntity(nga.entity('tags'));
  admin.addEntity(nga.entity('users'));
  admin.addEntity(nga.entity('servers'));
  admin.addEntity(nga.entity('dataSources'));
  admin.addEntity(nga.entity('manuals'));
  admin.addEntity(nga.entity('treebanks'));
  admin.addEntity(nga.entity('languages'));
  admin.addEntity(nga.entity('language-groups').readOnly());
  //
  // configure entities
  require('./tags/config')(nga, admin);
  require('./languages/config')(nga, admin);
  require('./users/config')(nga, admin);
  require('./servers/config')(nga, admin);
  require('./treebanks/config')(nga, admin);
  //
  admin.header(require('./header.html'));
  admin.menu(require('./menu')(nga, admin));

  // attach the admin application to the DOM and execute it
  nga.configure(admin);
}]);

pmltqAdmin.run(function ($rootScope, $state, $modal, $interval, authService, progression) {

  if (PRODUCTION) {
    $interval(() => {
      Restangular.one('auth').get();
    }, 600000, 0, false); // Ping server every 600 seconds to keep session alive
  }

  var loginModalInstance;
  $rootScope.$on('event:auth-loginRequired', function () {
    if (loginModalInstance) {
      return;
    }

    progression.done();
    loginModalInstance = $modal.open({
      template: require('./loginModal/template.html'),
      controller: require('./loginModal/controller'),
      controllerAs: 'vm',
      backdrop: 'static'
    }).result.then(() => {
      loginModalInstance = null;
      authService.loginConfirmed();
    }, () => console.log('Login failed'));
  });
});
