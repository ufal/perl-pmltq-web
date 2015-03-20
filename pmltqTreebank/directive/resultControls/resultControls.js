angular.module('pmltqTreebank').directive('resultControls', function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultControls',
    },
    templateUrl: 'pmltqTreebank/directive/resultControls/resultControls.html',
    link: function($scope) {
      $scope.$watch('result.resultNo', function(resultNo) {
        if (angular.isDefined(resultNo)) {
          $scope.result.currentResult = $scope.result.resultNodes[resultNo - 1];
        } else {
          $scope.result.currentResult = [];
        }
        $scope.result.tree = 0;
      });
    }
  };
});
