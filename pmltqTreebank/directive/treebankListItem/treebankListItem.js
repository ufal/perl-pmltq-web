angular.module('pmltqTreebank').directive('treebankListItem', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '='
    },
    templateUrl: 'pmltqTreebank/directive/treebankListItem/treebankListItem.html'
  };
});
