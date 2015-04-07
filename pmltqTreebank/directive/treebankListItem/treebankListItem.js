angular.module('pmltqTreebank').directive('treebankListItem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    templateUrl: 'pmltqTreebank/directive/treebankListItem/treebankListItem.html'
  };
});
