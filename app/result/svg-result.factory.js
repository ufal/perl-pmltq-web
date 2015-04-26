angular.module('pmltq.result').factory('svgResult', function ($, _, sentence, tredSvg) {

  function SvgResultFactory(svg) {
    var svgResult = {};

    svg = tredSvg(svg);

    _.forEach(['content', 'sentence', 'title', 'tree', 'highlightNodes'], function(method) {
      svgResult[method] = function() { return svg[method].apply(svg, arguments); };
    });

    return svgResult;
  }

  return SvgResultFactory;
});
