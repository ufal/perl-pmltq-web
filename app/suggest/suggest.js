var _ = require('lodash');

module.exports = function SuggestFactory(SuggestItem) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  /**
   * Create new suggest object from a PML-TQ query
   * @param {String} query
   * @property {String} this.originalQuery
   * @property {SuggestItem[]} this.parsedQuery
   * @constructor
   */
  function Suggest(query) {
    if (!(this instanceof Suggest)) {
      return new Suggest(query);
    }

    this.originalQuery = query;
    this.parsedQuery = Suggest.parseQuery(query);
  }

  /**
   * Parse query string into array of lines
   * @param {String} q
   * @return {SuggestItem[]}
   * @static
   */
  Suggest.parseQuery = function(q) {
    var lines = q.split('\n'),
      stack = [],
      parsedData = [],
      bracketsSpan = [];

    for (var index = 0; index < lines.length; index++) {
      var l = lines[index],
        item = new SuggestItem(l, index, parsedData);

      bracketsSpan[index] = item;
      // Push opening bracket
      if (/\[\s*$/.test(l)) {
        stack.push(index);
      }

      // Pop closing bracket
      if (/^\s*]\s*[,;]?\s*$/.test(l)) {
        bracketsSpan[stack.pop()].end = index;
      }

      parsedData.push(item);
    }

    // TODO: Throw error when stack is not empty
    return parsedData;
  };

  /**
   * Generate query from suggest
   * @return {String}
   */
  Suggest.prototype.query = function() {
    var parsedQuery = this.parsedQuery, query = [];
    var index = 0;
    while (index < parsedQuery.length) {
      var item = parsedQuery[index];
      if (item.enabled()) {
        query.push(_.repeat(' ', item.indent) + item.text());
      } else {
        index = item.end;
      }
      index += 1;
    }

    return query.join('\n');
  };

  Suggest.prototype.cleanup = function() {
    var parsedQuery = this.parsedQuery;
    var index = 0;
    while (index < parsedQuery.length) {
      var item = parsedQuery[index];
      if (!item.enabled()) {
        item.remove();
      } else {
        index += 1;
      }
    }
  };

  Suggest.prototype.reset = function() {
    this.parsedQuery = Suggest.parseQuery(this.originalQuery);
  };

  return Suggest;
};
