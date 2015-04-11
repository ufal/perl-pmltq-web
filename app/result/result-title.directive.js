angular.module('pmltq.result').directive('resultTitle', function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultTitle'
    },
    templateUrl: 'result/result-title.directive.html'
  };
});
