var ace = require('brace');
require('brace/ext/language_tools');

var oop = ace.acequire('ace/lib/oop');
var TextMode = ace.acequire('ace/mode/text').Mode;
var PmltqBehaviour = require('./behaviour');
var PmltqFoldMode = require('./folding');
var PmltqHighlightRules = require('./highlightRules');
var PmltqCompletions = require('./completion');
var AceRange = ace.acequire('ace/range').Range;

var PmltqMode = function () {
  this.HighlightRules = PmltqHighlightRules;
  this.$highlightRules = new PmltqHighlightRules();
  this.$completer = new PmltqCompletions();
  this.$behaviour = new PmltqBehaviour();
  this.foldingRules = new PmltqFoldMode();
};
oop.inherits(PmltqMode, TextMode);

(function () {
  this.getCompletions = function (state, session, pos, prefix) {
    return this.$completer.getCompletions(state, session, pos, prefix);
  };
  this.lineCommentStart = '#';
  this.getNextLineIndent = function (state, line, tab) {
    var indent = this.$getIndent(line);
    var match = line.match(/^.*[\{\(\[]\s*$/);
    if (match) {
      indent += tab;
    }
    return indent;
  };

  this.checkOutdent = function (state, line, input) {
    if (!/^\s+$/.test(line)) {
      return false;
    }
    return /^\s*[\}\]\)]/.test(input);
  };

  this.autoOutdent = function (state, doc, row) {
    var line = doc.getLine(row);
    var match = line.match(/^(\s*[\}\]\)])/);
    if (!match) {
      return 0;
    }
    var column = match[1].length;
    var openBracePos = doc.findMatchingBracket({
      row: row,
      column: column
    });
    if (!openBracePos || openBracePos.row === row) {
      return 0;
    }
    var indent = this.$getIndent(doc.getLine(openBracePos.row));
    doc.replace(new AceRange(row, 0, row, column - 1), indent);
  };

  this.$getIndent = function (line) {
    return line.match(/^\s*/)[0];
  };
}).call(PmltqMode.prototype);

module.exports = PmltqMode;
