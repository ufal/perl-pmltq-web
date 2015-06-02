angular.module('pmltq.help').directive('queryExample', function($interpolate) {

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      treebank: '='
    },
    templateUrl: 'help/query-example.directive.html',
    link: function ($scope, $element, $attr, $controller, $transclude) {
      $transclude(function (clone, tScope) {
        var queryText = clone.filter(function () {
          return this.nodeType !== 3;
        }).text();
        $scope.query = $interpolate(queryText)(tScope);
        // TODO resize minimized readonly editor
      });

      $scope.tryQuery = function() {
        $scope.$emit('tryQuery', $scope.query); // NOT taken from editor !!!
      };
    }
  };
});
