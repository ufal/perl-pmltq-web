var _ = require('lodash');
var $ = require('jquery');

const styleRe = new RegExp('-(.+)=>(.+)');
//noinspection JSUnusedGlobalSymbols
const styleMap = {
  foreground: function (m) {
    return {color: m[2]};
  },
  over: function () {
    return {'text-decoration': 'line-through'};
  }
};

class Token {

  constructor(text, tree) {
    this.text = text;
    this.tree = tree;
    this.classes = {};
    this.style = {};
    this.ids = [];
  }

  animateNodes() {
    this.tree.animateNodes(this.ids);
  }

  static fromCssClass(text, tree, cssClasses) {
    var token = new Token(text, tree),
      parts = cssClasses.split(/\s+/);

    while (parts.length > 0) {
      var part = parts.shift();

      switch (part.charAt(0)) {
        case '-':
          if (parts[0] === '=>') {
            part += parts.shift() + parts.shift();
          }
          var matches = styleRe.exec(part);
          if (matches && styleMap[matches[1]]) {
            _.extend(token.style, styleMap[matches[1]](matches));
          }
          break;
        case '#':
          token.ids.push(part.substring(1));
          break;
        default:
          token.classes[part] = true;
      }
    }

    return token;
  }

}

class Sentence extends Array {

  /**
   * @param {Token[]} tokens
   * @param {TredTree} tree
   */
  constructor(tokens, tree) {
    super();
    this.push.apply(this, tokens);
    this._tree = tree;
  }

  get nodeHover() {
    return this._tree.nodeHover;
  }

  highlightTokens(tokenId) {
    if (this.lastHighlightedToken === tokenId) {
      return;
    }

    if (!this.idsIndex) {
      this.rebuildTokenIndex();
    }

    var tokens = this.idsIndex[tokenId];
    if (tokens) {
      for (var i = tokens.length - 1; i >= 0; i--) {
        tokens[i].classes.highlight = true;
      }
    }
  }

  clearHighlight() {
    for (var i = this.length - 1; i >= 0; i--) {
      this[i].classes.highlight = false;
    }
  }

  rebuildTokenIndex() {
    var index = this.idsIndex = {};

    for (var i = this.length - 1; i >= 0; i--) {
      var token = this[i];
      for (var j = token.ids.length - 1; j >= 0; j--) {
        var id = token.ids[j],
          rec = index[id];
        if (!rec) {
          rec = index[id] = [];
        }
        rec.push(token);
      }
    }
  }
}

function TredSentenceFactory(tokens, tree) {

  tokens = tokens.map((index, tokenEl) => {
    tokenEl = $(tokenEl);
    return Token.fromCssClass(tokenEl.text(), tree, tokenEl.attr('class'));
  }).toArray();

  return new Sentence(tokens, tree);
}

module.exports = TredSentenceFactory;
