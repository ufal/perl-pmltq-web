angular.module('pmltq.help').directive('treebankHelp', function() {

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankHelp',
      queryParams: '=?'
    },
    templateUrl: 'help/treebank-help.directive.html',
    link: function($scope) {
      console.log('TH SCOPE: ', $scope);
      $scope.$on('tryQuery', function (e, query) {
        if ($scope.queryParams) {
          $scope.queryParams.runQuery(query);
        }
      });
    }
  };
});
