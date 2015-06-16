/* @ngInject */
function LoginModalFactory(uiModal, authService, Auth) {

  function LoginModal(rejectedResponse) {
    var m = uiModal({
      template: 'auth/login-modal.html',
      controller: 'LoginModalController',
      controllerAs: 'vm',
      closable: false,
      locals: {required: !!rejectedResponse},
      onHidden: function () {
        if (rejectedResponse && !Auth.loggedIn) {
          authService.loginCancelled('Login failed', rejectedResponse);
        }
        m.destroy();
        m = null;
      }
    });

    return m;
  }

  return LoginModal;
}

angular
  .module('pmltq.auth')
  .factory('loginModal', LoginModalFactory);
