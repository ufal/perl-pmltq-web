angular.module('pmltq.treebank').directive('treebankListItem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    templateUrl: 'treebank/treebank-list-item.directive.html',
    link: function($scope, $element, $attr) {
      $attr.$observe('href', function(url) {
        $scope.url = url;
      });
    }
  };
});
