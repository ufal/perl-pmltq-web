module.exports = function LoginModalFactory(uiModal, authService, Auth) {
  'ngInject';

  function LoginModal(rejectedResponse) {
    //noinspection JSUnusedGlobalSymbols
    var m = uiModal({
      template: require('./template.jade'),
      controller: require('./controller'),
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
};
