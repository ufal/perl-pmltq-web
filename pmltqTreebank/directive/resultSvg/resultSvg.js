angular.module('pmltqTreebank')
  .directive('resultSvg', function () {
    return {
      restrict: 'A',
      scope: {
        treebank: '=resultSvg',
        tree: '@',
        node: '@',
        svg: '=*?'
      },
      transclude: true,
      templateUrl: 'pmltqTreebank/directive/resultSvg/resultSvg.html',
      link: function ($scope, $element, $attrs, controller) {
        var lastNode, lastTree;

        $scope.$watchGroup(['tree', 'node', 'treebank'], function showSvg () {
          var node = $scope.node,
              tree = $scope.tree,
              treebank = $scope.treebank;

          if (_.some([treebank, node, tree], angular.isUndefined)) {
            lastNode = lastTree = undefined;
            $scope.svg.empty = true;
            return;
          }

          if (lastNode === node && lastTree === tree) {
            return;
          } else {
            lastNode = node;
            lastTree = tree;
          }

          // TODO: handle error
          treebank.loadSvg(node, tree).then(function (svgParsed) {
            $scope.svg.empty = false;
            angular.extend($scope.svg, svgParsed);
          }, function() {
            $scope.svg.empty = true;
          });
        });
      }
    };
  })
  .directive('svgContent', function() {
    return {
      restrict: 'A',
      scope: {
        svg: '=svgContent'
      },
      link: function ($scope, $element, $attrs, resultSvg) {
        $scope.$watch('svg', function (svg) {
          if (!svg) {
            $element.empty();
          } else {
            $element.html(svg);
          }
        }, false);
      }
    };
  });
