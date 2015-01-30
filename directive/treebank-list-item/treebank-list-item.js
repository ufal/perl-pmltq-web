angular.module('pmltqWeb').directive('treebankListItem', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '='
    },
    templateUrl: 'directive/treebank-list-item/treebank-list-item.html'
  };
});
