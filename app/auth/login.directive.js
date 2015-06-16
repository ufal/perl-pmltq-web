angular.module('pmltq.auth').directive('login', function(loginModal) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      var m;
      $element.click(function (e) {
        e.preventDefault();

        m = loginModal();
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
