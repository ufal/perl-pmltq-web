angular.module('pmltq.auth').directive('logout', function(Auth, $state) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.click(function (e) {
        e.preventDefault();

        Auth.logout().then(function () {
          $state.go('home');
        });
      });
    }
  };
});
