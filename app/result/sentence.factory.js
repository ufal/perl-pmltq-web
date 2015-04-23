angular.module('pmltq.result').factory('sentence', function(_, $) {

  var styleRe = new RegExp('-(.+)=>(.+)');
  var styleMap = {
    foreground: function(m) { return {color: m[2]}; },
    over: function() { return {'text-decoration': 'line-through'}; }
  };

  function parseClasses(str) {
    var res = {
          classes: {},
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
          res.classes[part] = true;
      }
    }

    return res;
  }

  function Sentence() { /* Intentionally empty */ }

  Sentence.prototype = _.create(Array.prototype, {
    highlightNode: function(nodeId) {
      if (this.lastHighlightedNode === nodeId) {
        return;
      }

      if (!this.idsIndex) {
        this.rebuildNodeIndex();
      }

      var nodes = this.idsIndex[nodeId];
      if (nodes) {
        for (var i = nodes.length - 1; i >= 0; i--) {
          var node = nodes[i];
          node.classes.highlight = true;
        }
      }
    },
    clearHighlight: function() {
      for (var i = this.length - 1; i >= 0; i--) {
        this[i].classes.highlight = false;
      }
    },
    rebuildNodeIndex: function() {
      var index = this.idsIndex = {};

      for (var i = this.length - 1; i >= 0; i--) {
        var token = this[i];
        for (var j = token.ids.length - 1; j >= 0; j--) {
          var id = token.ids[j],
              rec = index[id];
          if (!rec) { rec = index[id] = []; }
          rec.push(token);
        }
      }
    }
  });

  function SentenceFactory(svgResult) {
    var sentence = new Sentence(),
        descNode = svgResult.content().children('desc').remove();

    if (_.isEmpty(descNode)) {
      return sentence;
    }

    descNode.find('span[class]').each(function() {
      var $this = $(this),
          classStr = $this.attr('class'),
          parsedData = parseClasses(classStr); // TODO: Convert this to some class maybe
      parsedData.text = $this.text();
      sentence.push(parsedData);
    });

    return sentence;
  }

  return SentenceFactory;
});
