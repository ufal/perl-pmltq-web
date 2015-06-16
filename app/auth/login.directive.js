angular.module('pmltq.auth').directive('login', function(uiModal) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      var m;
      $element.click(function (e) {
        e.preventDefault();

        m = uiModal({
          template: 'auth/login-modal.html',
          controller: 'LoginModalController',
          controllerAs: 'vm'
        });
        m.promise.then(function () {
          m.show();
        });
      });

      $scope.$on('$destroy', function () {
        if (m) {
          m.destroy();
        }
      });
    }
  };
});
