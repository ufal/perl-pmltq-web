angular.module('pmltq.help').directive('queryExample', function() {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {},
    templateUrl: 'help/query-example.directive.html',
    link: function($scope, $element) {
      $scope.tryQuery = function() {
        $scope.$emit('tryQuery', $element.find('pre').text());
      };
      // DO syntax highlighting
    }
  };
});
