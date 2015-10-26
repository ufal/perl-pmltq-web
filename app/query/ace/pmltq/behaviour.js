var ace = require('brace');

var oop = ace.acequire('ace/lib/oop');
var Behaviour = ace.acequire('ace/mode/behaviour').Behaviour;
var TokenIterator = ace.acequire('ace/token_iterator').TokenIterator;
var lang = ace.acequire('ace/lib/lang');

var SAFE_INSERT_IN_TOKENS =
  ['text', 'paren.rparen', 'punctuation.operator'];
var SAFE_INSERT_BEFORE_TOKENS =
  ['text', 'paren.rparen', 'punctuation.operator', 'comment'];

var context;
var contextCache = {};
var initContext = function (editor) {
  var id = -1;
  if (editor.multiSelect) {
    id = editor.selection.index;
    if (contextCache.rangeCount !== editor.multiSelect.rangeCount) {
      contextCache = {rangeCount: editor.multiSelect.rangeCount};

    }
  }
  if (contextCache[id]) {
    context = contextCache[id];
    return context;
  }
  context = contextCache[id] = {
    autoInsertedBrackets: 0,
    autoInsertedRow: -1,
    autoInsertedLineEnd: '',
    maybeInsertedBrackets: 0,
    maybeInsertedRow: -1,
    maybeInsertedLineStart: '',
    maybeInsertedLineEnd: ''
  };
};

var getWrapped = function (selection, selected, opening, closing) {
  var rowDiff = selection.end.row - selection.start.row;
  return {
    text: opening + selected + closing,
    selection: [
      0,
      selection.start.column + 1,
      rowDiff,
      selection.end.column + (rowDiff ? 0 : 1)
    ]
  };
};

var PmltqBehaviour = function () {
  this.add('brackets', 'insertion', function (state, action, editor, session, text) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    var rightChar, nextIndent;
    if (text === '[') {
      initContext(editor);
      var selection = editor.getSelectionRange();
      var selected = session.doc.getTextRange(selection);
      if (selected !== '' && selected !== '[' && editor.getWrapBehavioursEnabled()) {
        return getWrapped(selection, selected, '[', ']');
      } else if (PmltqBehaviour.isSaneInsertion(editor, session)) {
        if (/[\]}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
          PmltqBehaviour.recordAutoInsert(editor, session, ']');
          return {
            text: '{}',
            selection: [1, 1]
          };
        } else {
          PmltqBehaviour.recordMaybeInsert(editor, session, '[');
          return {
            text: '[',
            selection: [1, 1]
          };
        }
      }
    } else if (text === ']') {
      initContext(editor);
      rightChar = line.substring(cursor.column, cursor.column + 1);
      if (rightChar === ']') {
        var matching = session.$findOpeningBracket(']', {column: cursor.column + 1, row: cursor.row});
        if (matching !== null && PmltqBehaviour.isAutoInsertedClosing(cursor, line, text)) {
          PmltqBehaviour.popAutoInsertedClosing();
          return {
            text: '',
            selection: [1, 1]
          };
        }
      }
    } else if (text === '\n' || text === '\r\n') {
      initContext(editor);
      var closing = '';
      if (PmltqBehaviour.isMaybeInsertedClosing(cursor, line)) {
        closing = lang.stringRepeat(']', context.maybeInsertedBrackets);
        PmltqBehaviour.clearMaybeInsertedClosing();
      }
      rightChar = line.substring(cursor.column, cursor.column + 1);
      if (rightChar === ']') {
        var openBracketPos = session.findMatchingBracket({row: cursor.row, column: cursor.column + 1}, ']');
        if (!openBracketPos) {
          return null;
        }
        nextIndent = this.$getIndent(session.getLine(openBracketPos.row));
      } else if (closing) {
        nextIndent = this.$getIndent(line);
      } else {
        PmltqBehaviour.clearMaybeInsertedClosing();
        return;
      }
      var indent = nextIndent + session.getTabString();

      return {
        text: '\n' + indent + '\n' + nextIndent + closing,
        selection: [1, indent.length, 1, indent.length]
      };
    } else {
      PmltqBehaviour.clearMaybeInsertedClosing();
    }
  });

  this.add('brackets', 'deletion', function (state, action, editor, session, range) {
    var selected = session.doc.getTextRange(range);
    if (!range.isMultiLine() && selected === '[') {
      initContext(editor);
      var line = session.doc.getLine(range.start.row);
      var rightChar = line.substring(range.end.column, range.end.column + 1);
      if (rightChar === ']') {
        range.end.column++;
        return range;
      } else {
        context.maybeInsertedBrackets--;
      }
    }
  });

  this.add('parens', 'insertion', function (state, action, editor, session, text) {
    if (text === '(') {
      initContext(editor);
      var selection = editor.getSelectionRange();
      var selected = session.doc.getTextRange(selection);
      if (selected !== '' && editor.getWrapBehavioursEnabled()) {
        return getWrapped(selection, selected, '(', ')');
      } else if (PmltqBehaviour.isSaneInsertion(editor, session)) {
        PmltqBehaviour.recordAutoInsert(editor, session, ')');
        return {
          text: '()',
          selection: [1, 1]
        };
      }
    } else if (text === ')') {
      initContext(editor);
      var cursor = editor.getCursorPosition();
      var line = session.doc.getLine(cursor.row);
      var rightChar = line.substring(cursor.column, cursor.column + 1);
      if (rightChar === ')') {
        var matching = session.$findOpeningBracket(')', {column: cursor.column + 1, row: cursor.row});
        if (matching !== null && PmltqBehaviour.isAutoInsertedClosing(cursor, line, text)) {
          PmltqBehaviour.popAutoInsertedClosing();
          return {
            text: '',
            selection: [1, 1]
          };
        }
      }
    }
  });

  this.add('parens', 'deletion', function (state, action, editor, session, range) {
    var selected = session.doc.getTextRange(range);
    if (!range.isMultiLine() && selected === '(') {
      initContext(editor);
      var line = session.doc.getLine(range.start.row);
      var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
      if (rightChar === ')') {
        range.end.column++;
        return range;
      }
    }
  });

  this.add('braces', 'insertion', function (state, action, editor, session, text) {
    if (text === '{') {
      initContext(editor);
      var selection = editor.getSelectionRange();
      var selected = session.doc.getTextRange(selection);
      if (selected !== '' && editor.getWrapBehavioursEnabled()) {
        return getWrapped(selection, selected, '{', '}');
      } else if (PmltqBehaviour.isSaneInsertion(editor, session)) {
        PmltqBehaviour.recordAutoInsert(editor, session, '}');
        return {
          text: '[]',
          selection: [1, 1]
        };
      }
    } else if (text === '}') {
      initContext(editor);
      var cursor = editor.getCursorPosition();
      var line = session.doc.getLine(cursor.row);
      var rightChar = line.substring(cursor.column, cursor.column + 1);
      if (rightChar === '}') {
        var matching = session.$findOpeningBracket('}', {column: cursor.column + 1, row: cursor.row});
        if (matching !== null && PmltqBehaviour.isAutoInsertedClosing(cursor, line, text)) {
          PmltqBehaviour.popAutoInsertedClosing();
          return {
            text: '',
            selection: [1, 1]
          };
        }
      }
    }
  });

  this.add('braces', 'deletion', function (state, action, editor, session, range) {
    var selected = session.doc.getTextRange(range);
    if (!range.isMultiLine() && selected === '{') {
      initContext(editor);
      var line = session.doc.getLine(range.start.row);
      var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
      if (rightChar === '}') {
        range.end.column++;
        return range;
      }
    }
  });

  this.add('string_dquotes', 'insertion', function (state, action, editor, session, text) {
    if (text === '"' || text === "'") {
      initContext(editor);
      var quote = text;
      var selection = editor.getSelectionRange();
      var selected = session.doc.getTextRange(selection);
      if (selected !== '' && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
        return getWrapped(selection, selected, quote, quote);
      } else if (!selected) {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        var leftChar = line.substring(cursor.column - 1, cursor.column);
        var rightChar = line.substring(cursor.column, cursor.column + 1);

        var token = session.getTokenAt(cursor.row, cursor.column);
        var rightToken = session.getTokenAt(cursor.row, cursor.column + 1);
        if (leftChar === "'" && token && /escape/.test(token.type)) {
          return null;
        }

        var stringBefore = token && /string|escape/.test(token.type);
        var stringAfter = !rightToken || /string|escape/.test(rightToken.type);

        var pair;
        if (rightChar === quote) {
          pair = stringBefore !== stringAfter;
        } else {
          if (stringBefore && !stringAfter) {
            return null;
          } // wrap string with different quote
          if (stringBefore && stringAfter) {
            return null;
          } // do not pair quotes inside strings
          var wordRe = session.$mode.tokenRe;
          wordRe.lastIndex = 0;
          var isWordBefore = wordRe.test(leftChar);
          wordRe.lastIndex = 0;
          var isWordAfter = wordRe.test(leftChar);
          if (isWordBefore || isWordAfter) {
            return null;
          } // before or after alphanumeric
          if (rightChar && !/[\s;,.})\]\\]/.test(rightChar)) {
            return null;
          } // there is rightChar and it isn't closing
          pair = true;
        }
        return {
          text: pair ? quote + quote : '',
          selection: [1, 1]
        };
      }
    }
  });

  this.add('string_dquotes', 'deletion', function (state, action, editor, session, range) {
    var selected = session.doc.getTextRange(range);
    if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
      initContext(editor);
      var line = session.doc.getLine(range.start.row);
      var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
      if (rightChar === selected) {
        range.end.column++;
        return range;
      }
    }
  });

};

PmltqBehaviour.isSaneInsertion = function (editor, session) {
  var cursor = editor.getCursorPosition();
  var iterator = new TokenIterator(session, cursor.row, cursor.column);
  if (!this.$matchTokenType(iterator.getCurrentToken() || 'text', SAFE_INSERT_IN_TOKENS)) {
    var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
    if (!this.$matchTokenType(iterator2.getCurrentToken() || 'text', SAFE_INSERT_IN_TOKENS)) {
      return false;
    }
  }
  iterator.stepForward();
  return iterator.getCurrentTokenRow() !== cursor.row ||
    this.$matchTokenType(iterator.getCurrentToken() || 'text', SAFE_INSERT_BEFORE_TOKENS);
};

PmltqBehaviour.$matchTokenType = function (token, types) {
  return types.indexOf(token.type || token) > -1;
};

PmltqBehaviour.recordAutoInsert = function (editor, session, bracket) {
  var cursor = editor.getCursorPosition();
  var line = session.doc.getLine(cursor.row);
  if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0])) {
    context.autoInsertedBrackets = 0;
  }
  context.autoInsertedRow = cursor.row;
  context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
  context.autoInsertedBrackets++;
};

PmltqBehaviour.recordMaybeInsert = function (editor, session, bracket) {
  var cursor = editor.getCursorPosition();
  var line = session.doc.getLine(cursor.row);
  if (!this.isMaybeInsertedClosing(cursor, line)) {
    context.maybeInsertedBrackets = 0;
  }
  context.maybeInsertedRow = cursor.row;
  context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
  context.maybeInsertedLineEnd = line.substr(cursor.column);
  context.maybeInsertedBrackets++;
};

PmltqBehaviour.isAutoInsertedClosing = function (cursor, line, bracket) {
  return context.autoInsertedBrackets > 0 &&
    cursor.row === context.autoInsertedRow &&
    bracket === context.autoInsertedLineEnd[0] &&
    line.substr(cursor.column) === context.autoInsertedLineEnd;
};

PmltqBehaviour.isMaybeInsertedClosing = function (cursor, line) {
  return context.maybeInsertedBrackets > 0 &&
    cursor.row === context.maybeInsertedRow &&
    line.substr(cursor.column) === context.maybeInsertedLineEnd &&
    line.substr(0, cursor.column) === context.maybeInsertedLineStart;
};

PmltqBehaviour.popAutoInsertedClosing = function () {
  context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
  context.autoInsertedBrackets--;
};

PmltqBehaviour.clearMaybeInsertedClosing = function () {
  if (context) {
    context.maybeInsertedBrackets = 0;
    context.maybeInsertedRow = -1;
  }
};

oop.inherits(PmltqBehaviour, Behaviour);

module.exports = PmltqBehaviour;
