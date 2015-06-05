angular.module('pmltq.treebank').directive('treebankListItem', function($state) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    templateUrl: 'treebank/treebank-list-item.directive.html',
    link: function($scope) {

      $scope.$watch('treebank', function(treebank) {
        if (treebank) {
          $scope.url = $state.href('treebank.index', {treebankId: treebank.name});
        } else {
          $scope.url = '';
        }
      });
    }
  };
});
