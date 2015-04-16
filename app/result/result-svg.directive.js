angular.module('pmltq.result')
  .directive('resultSvg', function () {
    return {
      restrict: 'A',
      scope: {
        treebank: '=resultSvg',
        tree: '@',
        node: '@',
        svg: '=*?'
      },
      // transclude: true,
      // replace: true,
      // templateUrl: 'result/result-svg.directive.html',
      link: function ($scope, $element, $attrs, controller) {
        var lastNode, lastTree;

        if ($scope.svg) {
          $scope.svg = {};
        }

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
  .directive('svgContent', function($, svgPanZoom, $window) {
    var panOptions = {
      fit: 1,
      minZoom: 0.5,
      maxZoom: 1.5,
      zoomEnabled: false
    };

    return {
      restrict: 'A',
      scope: {
        svg: '=svgContent'
      },
      link: function ($scope, $element, $attrs) {
        var panZoom = null;

        function resizeHandler () {
          if (panZoom) {
            panZoom.resize();
            panZoom.fit();
          }
        }

        $($element).css({overflow: 'hidden'});
        $($window).bind('resize', resizeHandler);

        $scope.$watch('svg', function (svg) {
          if (!svg) {
            if (panZoom) {
              panZoom.destroy();
            }
            $element.empty();
          } else {
            var content = svg();
            $element.html(content);
            panZoom = svgPanZoom(content[0], panOptions);
            $('#svg-pan-zoom-controls', $element)
              .attr('transform', 'translate(' + (content[0].clientWidth - 70) + ' 0) scale(0.75)');
          }
        }, false);

        $scope.$on('destroy', function() {
          $($window).unbind('resize', resizeHandler);
        });
      }
    };
  });
