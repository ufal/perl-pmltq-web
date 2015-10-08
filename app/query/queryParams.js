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
    _.defaults(this, /** @lends QueryParams.prototype */ {
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

  return QueryParams;
};
