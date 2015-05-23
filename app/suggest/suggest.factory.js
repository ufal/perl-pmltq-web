/* @ngInject */
function SuggestFactory(SuggestItem, _) {

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
    for (var i = 0; i < parsedQuery.length; i++) {
      var item = parsedQuery[i];
      if (item.enabled()) {
        query.push(_.repeat(' ', item.indent) + item.text);
      }
    }

    return query.join('\n');
  };

  return Suggest;
}

angular
  .module('pmltq.suggest')
  .factory('Suggest', SuggestFactory);
