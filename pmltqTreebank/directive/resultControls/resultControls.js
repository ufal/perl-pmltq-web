angular.module('pmltqTreebank').directive('resultControls', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    require: '^queryForm',
    templateUrl: 'pmltqTreebank/directive/resultControls/resultControls.html',
    link: function($scope, $element, $attrs, queryForm) {
      //$scope.queryForm = queryForm;
    }
  };
});
