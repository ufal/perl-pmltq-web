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
    highlightToken: function(tokenId) {
      if (this.lastHighlightedToken === tokenId) {
        return;
      }

      if (!this.idsIndex) {
        this.rebuildtokenIndex();
      }

      var tokens = this.idsIndex[tokenId];
      if (tokens) {
        for (var i = tokens.length - 1; i >= 0; i--) {
          var token = tokens[i];
          token.classes.highlight = true;
        }
      }
    },
    clearHighlight: function() {
      for (var i = this.length - 1; i >= 0; i--) {
        this[i].classes.highlight = false;
      }
    },
    rebuildTokenIndex: function() {
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

  function SentenceFactory(tokens, result) {
    var sentence = new Sentence();

    if (_.isEmpty(tokens)) {
      return sentence;
    }

    tokens.each(function() {
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
