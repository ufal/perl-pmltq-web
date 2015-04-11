angular.module('pmltq.result').directive('resultView', function(constants) {
  var STATE_LOADING = constants.STATE_LOADING;

  return {
    restrict: 'A',
    scope: {
      treebank: '=resultView',
      result:   '=*queryResult'
    },
    templateUrl: 'result/result-view.directive.html'
    link: function($scope, $element, $attrs) {
      constants.extractTo($scope);
      $scope.$watch('result.submited', function(val) {
        if (val === true) {
          $scope.state = STATE_LOADING;
        }
      });

      $scope.$watch('result.resultId', function(resultId) {
        var result = $scope.result;

        if (resultId) {
          $scope.state = result.type;
        }
      });
    }
  };
});
