/* @ngInject */
function QueryParamsFactory($state) {

  /**
   * Encapsulation of suggest item (a query line) properties
   * @param {String} query
   * @param {Number} limit
   * @param {Number} timeout
   * @constructor
   */
  function QueryParams(query, limit, timeout) {
    if (!(this instanceof QueryParams)) {
      return new QueryParams(query, limit, timeout);
    }

    this.query = query;
    this.limit = limit;
    this.timeout = timeout;
  }

  QueryParams.prototype.runQuery = function(query) {
    this.query = query;
    this.execute = true;
    if ($state.$current.name !== 'treebank.query.index') {
      $state.go('treebank.query.index');
    }
  };

  QueryParams.prototype.params = function() {
    return {
      query: this.query,
      limit: this.limit,
      timeout: this.timeout
    };
  };

  return QueryParams;
}

angular
  .module('pmltq.query')
  .factory('QueryParams', QueryParamsFactory);
