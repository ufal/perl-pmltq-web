angular.module('pmltq.auth').directive('login', function(uiModal) {
  var modal;

  function getModal() {
    if (!modal) {
      modal = uiModal({
        template: 'auth/login-modal.html',
        controller: 'LoginModalController',
        controllerAs: 'vm'
      });
    }
    return modal;
  }

  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.click(function (e) {
        e.preventDefault();

        var m = getModal($scope);
        m.promise.then(function () {
          m.show();
        });
      });

      $scope.$on('$destroy', function () {
        if (modal) {
          modal.destroy();
        }
      });
    }
  };
});
