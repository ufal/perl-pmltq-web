/* @ngInject */
function QueryParamsFactory(_, $state, localStorageService) {

  /**
   * Encapsulation of suggest item (a query line) properties
   * @param {String} [treebankId=default]
   * @param {String} [query=]
   * @param {Number} [limit=100]
   * @param {Number} [timeout=30]
   * @param {Boolean} [filter=true]
   * @constructor
   */
  function QueryParams(treebankId, query, limit, timeout, filter) {
    if (!(this instanceof QueryParams)) {
      return new QueryParams(treebankId, query, limit, timeout, filter);
    }
    if (!treebankId) {
      treebankId = 'default';
    }
    _.defaults(this, {
      cacheKey: 'last-query-' + treebankId,
      query: '',
      limit: 100,
      timeout: 30
    });
    this.restore();

    if (query) {
      this.query = query;
    }

    if (limit > 0) {
      this.limit = limit;
    }

    if (timeout > 0) {
      this.timeout = timeout;
    }

    if (angular.isDefined(filter)) {
      this.filter = filter;
    }
  }

  QueryParams.prototype.restore = function() {
    var params = localStorageService.get(this.cacheKey);
    if (params) {
      _.assign(this, params);
    }
  };

  QueryParams.prototype.cache = function () {
    localStorageService.set(this.cacheKey, this.params());
  };

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
      timeout: this.timeout,
      filter: this.filter
    };
  };

  return QueryParams;
}

angular
  .module('pmltq.query')
  .factory('QueryParams', QueryParamsFactory);
