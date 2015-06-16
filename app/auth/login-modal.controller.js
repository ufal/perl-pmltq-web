/* @ngInject */
function LoginModalController($scope, Discojuice, Auth) {
  var vm = this;

  vm.auth = {
    email: '',
    password: '',
    remember: false
  };

  vm.discojuice = function () {
    var discojuice = new Discojuice();
    discojuice.then(function (result) {
      vm.discojuiceResult = result;
      Auth.ping().then(function () {
        $scope.hide();
      });
    }).catch(function () {
      vm.discojuiceResult = null;
    });
  };

  vm.login = function (data) {
    vm.loading = true;
    Auth.login(data).then(function () {
      $scope.hide();
    }).catch(function (res) {
      vm.errorText = res.data.error;
    }).finally(function () {
      vm.loading = false;
    });
  };
}

angular
  .module('pmltq.auth')
  .controller('LoginModalController', LoginModalController);
