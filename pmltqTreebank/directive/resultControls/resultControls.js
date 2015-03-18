angular.module('pmltqTreebank').directive('resultControls', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    require: '^queryForm',
    templateUrl: 'pmltqTreebank/directive/resultControls/resultControls.html',
    link: function($scope, $element, $attrs, queryForm) {
      var isChanging = false;
      $scope.queryForm = queryForm;
      $scope.resultNo = queryForm.currentResultNo;

      $scope.$on('result.svg', function(e, result, resultNo) {
        if (!isChanging) {
          $scope.resultNo = resultNo;
        }
      });

      $scope.$watch('resultNo', function(resultNo) {
        if (resultNo) {
          isChanging = true;
          queryForm.setCurrentResult(resultNo*1);
          isChanging = false;
        }
      });
    }
  };
});
