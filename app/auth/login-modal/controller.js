module.exports = function LoginModalController($scope, required, Discojuice, TestDiscojuice, Auth) {
  'ngInject';
  var vm = this;

  $scope.$on('$stateChangeStart', function () {
    $scope.hide();
  });

  vm.required = required;
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

  vm.testdiscojuice = function () {
    var discojuice = new TestDiscojuice();
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
};
