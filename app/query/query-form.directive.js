angular.module('pmltq.query').directive('queryForm', function() {
  var RESULT_TYPE_SVG = 'svg',
      RESULT_TYPE_TABLE = 'table';

  return {
    restrict: 'A',
    scope: {
      treebank: '=queryForm',
      params:   '=*?',
      result:   '=*?queryResult'
    },
    templateUrl: 'query/query-form.directive.html',
    link: function($scope, $element, $attrs) {
      if (!$scope.params) {
        // Save default params as they are changed
        $scope.params = {
          timeout: 30,
          limit: 100,
          query: "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];"
        };
      }

      $scope.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      $scope.limitSelect = [1, 10, 100, 1000, 10000];

      $scope.submit = function(queryData) {
        var result = $scope.result;
        if (!result) {
          return;
        }

        result.submit($scope.treebank, queryData);
      };
    }
  };
});
