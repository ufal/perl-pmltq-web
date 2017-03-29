/** @type _ */
var _ = require('lodash');

/** @type angular.IAngularStatic */
var angular = require('angular');

/**
 * @param {angular.ui.IState} $state
 * @param {angular.local.storage.ILocalStorageService} localStorageService
 * @return {QueryFileParams}
 * @constructor
 */
module.exports = function QueryFileParamsFactory($state, localStorageService, rx) {
  'ngInject';
 
  class QueryFileParams {
    /**
     * Encapsulation of suggest item (a query line) properties
     * @param {String} [treebankId=default]
     * @param {Number} [queryID=]
     * @param {Number} [fileID=0]
     * @constructor
    */
    constructor(treebankId, fileID, queryID = null) {
      if (!treebankId) {
        treebankId = 'default';
      }

      this.cacheKey = 'last-queryfile-' + treebankId;

      this.restore();

      this._file = angular.isDefined(fileID) ? fileID : null;
      this._query = angular.isDefined(queryID) ? queryID : null;
    }

    get queryID() {
      return this._query;
    }

    set queryID(query) {
      this._query = query;
      this.cache();
    }
    
    get fileID() {
      return this._file;
    }

    set fileID(file) {
      this._file = file;
      this.cache();
    }

    clear() {
      this._query = null;
      this._file = null;
      this.cache();
    }

    restore() {
      var params = localStorageService.get(this.cacheKey);
      if (params) {
        this._file = params.fileID;
        this._query = params.queryID;
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
        fileID: this.fileID,
        queryID: this.queryID
      };
    } 
  }

  return QueryFileParams;
};
