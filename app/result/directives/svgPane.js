var _ = require('lodash');

require('./svgPane.less');

module.exports = function () {
  return {
    restrict: 'A',
    scope: {
      nodes: '=?'
    },
    require: '^svgView',
    link: function ($scope, $element, $attrs, svgView) {
      svgView.trees.subscribe((tree) => {
        var fragment = tree.fragment;
        tree.reattachEvents();
        tree.highlightNodes($scope.nodes);
        $element.html(fragment.node);
        tree.resize();
      });
    }
  };
};
