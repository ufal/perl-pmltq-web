angular.module('pmltq.result').directive('resultTitle', function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultTitle'
    },
    templateUrl: 'pmltq.result/directive/resultTitle/resultTitle.html'
  };
});
