
module.exports =  function ($modalInstance, Restangular) {
  'ngInject';
  var vm = this;

  vm.auth = {
    username: 'admin',
    password: 'admin'
  };

  vm.login = function (auth) {
    vm.error = null;
    Restangular.one('').post('auth', { auth: vm.auth }).then((res) => {
      var data = res.data.plain(),
        user = data.user || {};
      if (user.isAdmin) {
        $modalInstance.close(user);
        return;
      }

      vm.error = 'Only administrator can login';
    }, (res) => vm.error = res.data.error || res.statusText)
  }
};
