angular.module('pmltqHelp').directive('treebankHelp', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      metadata: '=treebankHelp',
      navigation: '='
    },
    templateUrl: 'pmltqHelp/treebank/treebankHelp.html',
    link: function($scope) {
      if (angular.isUndefined($scope.navigation)) {
        $scope.navigation = true;
      }
    }
  };
});
