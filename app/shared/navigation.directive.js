angular.module('pmltq.shared').directive('navigation', function(Auth) {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: 'shared/navigation.directive.html',
    scope: true,
    link: function($scope) {
      $scope.loggedIn = Auth.loggedIn;
      $scope.username = Auth.user.name;

      $scope.$on('event:auth-loginConfirmed', function (e, user) {
        $scope.username = user.name;
        $scope.loggedIn = true;
      });

      $scope.$on('event:auth-loggedOut', function () {
        $scope.username = null;
        $scope.loggedIn = false;
      });
    }
  };
});
