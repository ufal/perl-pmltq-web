angular.module('pmltqTreebank').directive('resultTitle', function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultTitle'
    },
    templateUrl: 'pmltqTreebank/directive/resultTitle/resultTitle.html'
  };
});
