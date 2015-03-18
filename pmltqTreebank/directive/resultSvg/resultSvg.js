angular.module('pmltqTreebank')
  .directive('resultSvg', function () {
    return {
      restrict: 'A',
      scope: {
        treebank: '=resultSvg',
        tree: '@',
        node: '@'
      },
      templateUrl: 'pmltqTreebank/directive/resultSvg/resultSvg.html',
      controller: function ResultSvgController() {
        this.contentSvg = function (elem) {
          this.svgContentElement = elem;
        };
      },
      link: function ($scope, $element, $attrs, controller) {
        var lastNode, lastTree;

        $scope.$watchGroup(['tree', 'node', 'treebank'], function showSvg () {
          var node = $scope.node,
              tree = $scope.tree,
              treebank = $scope.treebank;

          if (_.some([treebank, node, tree], angular.isUndefined)) {
            lastNode = lastTree = undefined;
            $scope.svg = null;
            $element.empty();
            return;
          }

          if (lastNode === node && lastTree === tree) {
            return;
          } else {
            lastNode = node;
            lastTree = tree;
          }

          if (!controller.svgContentElement) {
            throw new Error('No element to set result svg into');
          }

          treebank.loadSvg(node, tree).then(function (svgParsed) {
            $scope.svg = svgParsed;
            controller.svgContentElement.html(svgParsed.$svg);
          });
        });
      }
    };
  })
  .directive('svgContent', function() {
    return {
      restrict: 'A',
      require: '^resultSvg',
      link: function ($scope, $element, $attrs, resultSvg) {
        resultSvg.contentSvg($element);
      }
    };
  });
