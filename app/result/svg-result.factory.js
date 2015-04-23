angular.module('pmltq.result').factory('svgResult', function($, sentence) {

  var titleTreeRe = new RegExp('\\((\\d+)/(\\d+)\\)$');

  function parseTitle(str) {
    var matches = titleTreeRe.exec(str);
    matches.shift();
    return matches;
  }

  function extractSvg(svgString) {
    var svg = $($.trim(svgString.replace(/<\?[\s\S]*?\?>/, '')));
    if (svg.length === 0) { return $('<svg />'); }
    svg.removeAttr('onload onmousemove onmouseout');
    svg.find('script').remove();
    return svg;
  }

  function SvgResultFactory(svg) {
    var svgResult = {},
        data = {};

    svgResult.content = function() {
      return _.isString(svg) ? (svg = extractSvg(svg)) : svg;
    };

    svgResult.sentence = function() {
      if (angular.isUndefined(data.sentence)) {
        data.sentence = sentence(svgResult);
      }
      return data.sentence;
    };

    svgResult.title = function() {
      if (angular.isUndefined(data.title)) {
        var title = svgResult.content().children('title');
        data.title = _.isEmpty(title) ? '' : title.text();
        if (!_.isEmpty(title)) {
          title.remove();
        }
      }
      return data.title;
    };

    svgResult.tree = function() {
      if (angular.isUndefined(data.tree)) {
        var arr = parseTitle(svgResult.title());
        data.tree = {
          current: parseInt(arr[0]),
          total: parseInt(arr[1])
        };
      }

      return data.tree;
    };

    return svgResult;
  }

  return SvgResultFactory;
});
