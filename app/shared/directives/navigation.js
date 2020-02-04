module.exports = function(Auth) {
  'ngInject';
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: require('./navigation.jade'),
    scope: true,
    link: function($scope) {
      $scope.loggedIn = Auth.loggedIn;
      $scope.username = Auth.user.validUntil == null ? Auth.user.name : '';
      $scope.devml='pmltq%40'+['ufal','mff','cuni','cz'].join('.');

      if(DEVELOPMENT){
        $scope.DEVELOPMENT = DEVELOPMENT;
        $scope.PING = function(){
          console.log('PING');
          Auth.ping();
        }
      }
      $scope.$on('event:auth-loginConfirmed', function (e, user) {
        $scope.username = user.validUntil == null ? user.name : '';
        $scope.loggedIn = true;
      });

      $scope.$on('event:auth-loggedOut', function () {
        $scope.username = null;
        $scope.loggedIn = false;
      });
    }
  };
};
