angular.module('pmltqTreebank').directive('treebankListItem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    templateUrl: 'pmltqTreebank/directive/treebankListItem/treebankListItem.html',
    link: function($scope, $element, $attr) {
      $attr.$observe('href', function(url) {
        $scope.url = url;
      });
    }
  };
});
