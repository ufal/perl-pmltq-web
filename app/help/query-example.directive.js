angular.module('pmltq.help').directive('queryExample', function() {

  return {
    restrict: 'A', //'E'
    replace: true,
    //transclude: true,
    scope: {
      treebank: '=queryExample',
      query:    '=?'
    },
    templateUrl: 'help/query-example.directive.html',
    link: function($scope, $element) {
      $scope.tryQuery = function() {
        $scope.$emit('tryQuery', $scope.query); // NOT taken from editor !!!
      };
    }
  };
});
