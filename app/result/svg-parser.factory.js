angular.module('pmltq.result').factory('svgParser', function() {

  var titleTreeRe = new RegExp('\\((\\d+)/(\\d+)\\)$');

  function parseTitle(str) {
    var matches = titleTreeRe.exec(str);
    matches.shift();
    return matches;
  }

  var styleRe = new RegExp('-(.+)=>(.+)');
  var styleMap = {
    foreground: function(m) { return {color: m[2]}; },
    over: function() { return {'text-decoration': 'line-through'}; }
  };

  function parseClasses(str) {
    var res = {
          classes: [],
          style: {},
          ids: []
        },
        parts = str.split(/\s+/);

    while (parts.length > 0) {
      var part = parts.shift();

      switch (part.charAt(0)) {
        case '-':
          if (parts[0] === '=>') {
            part += parts.shift() + parts.shift();
          }
          var matches = styleRe.exec(part);
          if (matches && styleMap[matches[1]]) {
            angular.extend(res.style, styleMap[matches[1]](matches));
          }
          break;
        case '#':
          res.ids.push(part);
          break;
        default:
          res.classes.push(part);
      }
    }

    return res;
  }

  function SvgParserFactory(svg) {
    var parser = {},
        data = {};

    function buildSentence() {
      var sentence = [],
          descNode = parser.content().children('desc').remove();

      if (_.isEmpty(descNode)) {
        return;
      }

      descNode.find('span[class]').each(function() {
        var style = '',
            $this = $(this),
            classStr = $this.attr('class'),
            parsedData = parseClasses(classStr);
        parsedData.text = $this.text();
        sentence.push(parsedData);
      });

      return sentence;
    }

    parser.content = function() {
      return _.isString(svg) ? (svg = $(svg)) : svg;
    };

    parser.sentence = function() {
      if (angular.isUndefined(data.sentence)) {
        data.sentence = buildSentence();
      }
      return data.sentence;
    };

    parser.title = function() {
      if (angular.isUndefined(data.title)) {
        var title = parser.content().children('title');
        data.title = _.isEmpty(title) ? '' : title.text();
      }
      return data.title;
    };

    parser.tree = function() {
      if (angular.isUndefined(data.tree)) {
        var arr = parseTitle(parser.title());
        data.tree = {
          current: parseInt(arr[0]),
          total: parseInt(arr[1])
        };
      }

      return data.tree;
    };

    return parser;
  }

  return SvgParserFactory;
});
