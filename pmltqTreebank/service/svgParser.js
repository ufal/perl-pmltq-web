angular.module('pmltqTreebank').factory('svgParser', function() {

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

    while(parts.length > 0) {
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
    var parser = { data: {} };

    svg = parser.content = $(svg);

    function buildSentence() {
      var sentence = [],
          descNode = parser.content.children('desc').remove();

      if (_.isEmpty(descNode)) {
        return;
      }

      descNode.find('span[class]').each(function() {
        var style = '',
            $this = $(this),
            classStr = $this.attr('class'),
            data = parseClasses(classStr);
        data.text = $this.text();
        sentence.push(data);
      });

      return sentence;
    }

    parser.sentence = function() {
      if (angular.isUndefined(parser.data.sentence)) {
        parser.data.sentence = buildSentence();
      }
      return parser.data.sentence;
    };

    parser.title = function () {
      if (angular.isUndefined(parser.data.title)) {
        var title = svg.children('title');
        parser.data.title = _.isEmpty(title) ? '' : title.text();
      }
      return parser.data.title;
    };

    return parser;
  }

	return SvgParserFactory;
});
