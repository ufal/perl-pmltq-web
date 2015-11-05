/** @type _ */
var _ = require('lodash');

/** @type angular.IAngularStatic */
var angular = require('angular');

/**
 * @param {angular.ui.IState} $state
 * @param {angular.local.storage.ILocalStorageService} localStorageService
 * @param {Rx} rx
 * @return {QueryParams}
 * @constructor
 */
module.exports = function QueryParamsFactory($state, localStorageService, rx) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  class QueryParams {
    /**
     * Encapsulation of suggest item (a query line) properties
     * @param {String} [treebankId=default]
     * @param {String} [query=]
     * @param {Number} [limit=100]
     * @param {Number} [timeout=30]
     * @param {Boolean} [filter=true]
     * @constructor
     */
    constructor(treebankId, query, limit = 30, timeout = 100, filter = true) {
      if (!treebankId) {
        treebankId = 'default';
      }

      this.cacheKey = 'last-query-' + treebankId;

      this.restore();

      if (query) {
        this._query = query;
      }

      this._limit = limit > 0 ? limit : 100;
      this._timeout = timeout > 0 ? timeout : 30;
      this._filter = angular.isDefined(filter) ? filter : true;
      this._oldParams = this.params();

      this.suggest = new rx.ReplaySubject(1);
    }

    get query() {
      return this._query;
    }

    set query(query) {
      this._query = query;
      this.cache();
    }

    get limit() {
      return this._limit;
    }

    set limit(limit) {
      this._limit = limit;
      this.cache();
    }

    get timeout() {
      return this._timeout;
    }

    set timeout(timeout) {
      this._timeout = timeout;
      this.cache();
    }

    get filter() {
      return this._filter;
    }

    set filter(filter) {
      this._filter = !!filter;
      this.cache();
    }

    clear() {
      this._query = '';
      this._filter = false;
      this.cache();
    }

    restore() {
      var params = localStorageService.get(this.cacheKey);
      if (params) {
        this._filter = params.filter;
        this._limit = params.limit;
        this._query = params.query;
        this._timeout = params.timeout;
      }
    }

    cache() {
      var params = this.params();
      if (!_.isEqual(this._oldParams, params)) {
        localStorageService.set(this.cacheKey, params);
        this._oldParams = params;
      }
    }

    params() {
      return {
        filter: this.filter,
        limit: this.limit,
        query: this.query,
        timeout: this.timeout
      };
    }
  }

  return QueryParams;
};
