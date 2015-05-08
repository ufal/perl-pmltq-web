angular.module('pmltq.result').factory('svgResult', function ($, _, sentence, tredSvg) {

  function SvgResultFactory(svg) {
    var svgResult = {};

    svg = tredSvg(svg);

    _.forEach(['content', 'sentence', 'title', 'tree', 'highlightNodes', 'resize'], function (method) {
      svgResult[method] = function() { return svg[method].apply(svg, arguments); };
    });

    svgResult.marked = {
      any: function() {
        return !_.isEmpty(svg.markedNodes);
      },
      nodes: function() {
        return _.keys(svg.markedNodes);
      },
      count: function() {
        return _.size(svg.markedNodes);
      }
    };
    return svgResult;
  }

  return SvgResultFactory;
});
