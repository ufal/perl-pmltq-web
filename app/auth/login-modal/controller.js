module.exports = function LoginModalController($scope, $window, required, Discojuice, Auth, apiBaseUrl) {
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

  vm.login_with = Auth.login_with;

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

  vm.oauth = function (service) {
     var l = $window.location,
      ORIGIN = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '');
    location.href = apiBaseUrl + '/auth/'+service + '?loc=' + l;
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
