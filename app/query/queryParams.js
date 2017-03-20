/** @type _ */
var _ = require('lodash');

/** @type angular.IAngularStatic */
var angular = require('angular');

/**
 * @param {angular.ui.IState} $state
 * @param {angular.local.storage.ILocalStorageService} localStorageService
 * @return {QueryParams}
 * @constructor
 */
module.exports = function QueryParamsFactory($state, localStorageService, rx) {
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
    /* 
  function QueryParams(treebankId, query, limit, timeout, filter) {
    if (!(this instanceof QueryParams)) {
      return new QueryParams(treebankId, query, limit, timeout, filter);
    }
    if (!treebankId) {
      treebankId = 'default';
    }
    _.defaults(this,  {
      cacheKey: 'last-query-' + treebankId,
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

    this.suggest = new rx.ReplaySubject(1);
  }

  QueryParams.prototype.text = function (val) {
    if (_.isUndefined(val)) {
      return this.query;
    }

    this.query = val;
    this.cache();
  };

  QueryParams.prototype.clear = function () {
    this.query = '';
    this.filter = false;
  };

  QueryParams.prototype.present = function () {
    return !!this.query;
  };

  QueryParams.prototype.restore = function () {
    var params = localStorageService.get(this.cacheKey);
    if (params) {
      this.filter = params.filter;
      this.limit = params.limit;
      this.query = params.query;
      this.timeout = params.timeout;
    }
  };

  QueryParams.prototype.cache = function () {
    localStorageService.set(this.cacheKey, this.params());
  };

  QueryParams.prototype.params = function () {
    return {
      filter: this.filter,
      limit: this.limit,
      query: this.query,
      timeout: this.timeout
    };
  };
  */
  return QueryParams;
};
