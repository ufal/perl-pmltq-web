angular.module('pmltqTreebank').directive('resultSvg', function() {
  return {
    restrict: 'A',
    scope: {
      treebank: '=resultSvg',
      tree: '@',
      node: '@'
    },
    require: '?^treebankDetail',
    link: function($scope, $element, $attrs, treebankDetail) {
      var lastNode, lastTree;

      $scope.$watchGroup(['tree', 'node', 'treebank'], function showSvg() {
        var node = $scope.node,
            tree = $scope.tree,
            treebank = $scope.treebank;

        if (_.some([treebank, node, tree], angular.isUndefined)) {
          $element.empty();
          return;
        }

        if (lastNode === node && lastTree === tree) {
          return;
        } else {
          lastNode = node;
          lastTree = tree;
        }

        treebank.loadSvg(node, tree).then(function(svg) {
          $element.html(svg);
        });
      });
    }
  };
});
