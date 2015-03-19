angular.module('pmltqTreebank').directive('resultView', function() {
  var HELP = 'help',
      LOADING = 'loading',
      RESULT_TYPE_SVG = 'svg',
      RESULT_TYPE_TABLE = 'table';

  return {
    restrict: 'A',
    scope: {
      treebank: '=resultView'
    },
    templateUrl: 'pmltqTreebank/directive/resultView/resultView.html',
    link: function($scope, $element, $attrs) {
      $scope.show = HELP;

      $scope.$on('query.submited', function () {
        $scope.show = LOADING;
      });

      $scope.$on('query.results', function(e, response) {
        var nodes = response.nodes,
            results = response.results,
            firstResult = results && results.length > 0 ? _.first(results) : [];

        if (nodes) {
          $scope.show = RESULT_TYPE_SVG;
          $scope.result = {
            resultNodes: results,
            nodesCount: results.length,
            currentResult: firstResult,
            queryNodes: nodes,
            activeNode: 0,
            resultNo: 1,
            tree: 0,
            svg: {}
          };
        } else {
          $scope.show = RESULT_TYPE_TABLE;
          $scope.result = {
            table: results
          };
        }
      });

      $scope.$on('query.error', function (e, err) {
        console.log(err);
      });
    }
  };
});
