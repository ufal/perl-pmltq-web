angular.module('pmltqTreebank').directive('resultControls', function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultControls',
    },
    templateUrl: 'pmltqTreebank/directive/resultControls/resultControls.html',
    link: function($scope) {
      $scope.$watch('result.resultNo', function(resultNo, oldResultNo) {
        var result = $scope.result;

        if (resultNo === oldResultNo) {
          return;
        }

        if (angular.isDefined(resultNo)) {
          result.currentResult = result.get()[resultNo - 1];
        } else {
          result.currentResult = [];
        }
        result.tree = 0;
      });
    }
  };
});
