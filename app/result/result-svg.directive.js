angular.module('pmltq.result')
  .directive('resultSvg', function () {
    return {
      restrict: 'A',
      scope: {
        treebank: '=resultSvg',
        tree: '@',
        node: '@',
        svg: '=?'
      },
      // transclude: true,
      // replace: true,
      // templateUrl: 'result/result-svg.directive.html',
      link: function ($scope) {
        var lastNode, lastTree;

        $scope.$watchGroup(['tree', 'node', 'treebank'], function showSvg () {
          var node = $scope.node,
              tree = $scope.tree,
              treebank = $scope.treebank;

          if (_.some([treebank, node, tree], angular.isUndefined)) {
            lastNode = lastTree = undefined;
            $scope.svg = null;
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
            $scope.svg = svgParsed;
          }, function() {
            $scope.svg = null;
          });
        });
      }
    };
  })
  .directive('svgContent', function ($, _) {
    return {
      restrict: 'A',
      scope: {
        svgResult: '=svgContent',
        nodes: '=?'
      },
      link: function ($scope, $element) {
        $scope.$watch('svgResult', function (svgResult) {
          if (_.isEmpty(svgResult)) {
            $element.empty();
          } else {
            var content = svgResult.content();
            svgResult.highlightNodes($scope.nodes);
            $element.html(content.node);
            svgResult.resize();
          }
        });
      }
    };
  });
