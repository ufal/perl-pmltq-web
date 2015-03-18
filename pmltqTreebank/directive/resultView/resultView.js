angular.module('pmltqTreebank').directive('resultView', function() {
  var HELP = 'help',
      LOADING = 'loading',
      RESULT_TYPE_SVG = 'svg',
      RESULT_TYPE_TABLE = 'table';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=resultView'
    },
    templateUrl: 'pmltqTreebank/directive/resultView/resultView.html',
    link: function($scope, $element, $attrs) {
      $scope.show = HELP;

      $scope.$on('query.submited', function () {
        $scope.show = LOADING;
      });

      $scope.$on('result.' + RESULT_TYPE_SVG, function (e, result, resultNo) {
        $scope.result = {
          resultType: RESULT_TYPE_SVG,
          node: _.first(result),
          resultNo: resultNo,
          tree: 0
        };
      });

      $scope.$on('result.' + RESULT_TYPE_TABLE, function(e, resultsTable) {
        $scope.result = {
          resultType: RESULT_TYPE_TABLE,
          table: resultsTable
        };
      });

      // $scope.$on('query.error', function (e, err) {
      //   console.log(err);
      //   $scope.show = HELP;
      //   $scope.error = err;
      // });

      $scope.$on('result.type', function (e, type) {
        $scope.show = type;
      });
    }
  };
});
