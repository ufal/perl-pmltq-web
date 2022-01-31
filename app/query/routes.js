/** @type _ */
var _ = require('lodash');

/** @type LZString */
var lz = require('lz-string');

const compressQuery = _.memoize(lz.compressToEncodedURIComponent);
const decompressQuery = _.memoize(lz.decompressFromEncodedURIComponent);

/**
 * @param {angular.ui.IStateProvider} $stateProvider
 * @param {angular.ui.IUrlMatcherFactory} $urlMatcherFactoryProvider
 */
module.exports = function ($stateProvider, $urlMatcherFactoryProvider) {
  'ngInject';

  $urlMatcherFactoryProvider.type('compressed', {
    encode: (item) => {
      if (!item) { return null; }
      item = compressQuery(item);
      return item;
    },
    decode: (item) => {
      if (!item) { return null; }
      item = decompressQuery(item);
      return item;
    },
    is: (val) => val && typeof val === 'string' && val.length && (!decompressQuery(val) || val.indexOf('#') >= 0 || val.match(/\[.*\]/))
  });

  $stateProvider.state('treebank.query', {
    url: '/query/{query:compressed}?{filter}&{timeout}&{limit}',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    title: 'Query',
    abstract: true,
    params: {
      query: {squash: false, value: null},
      filter: {squash: false},
      timeout: {squash: false},
      limit: {squash: false},
    }
  });

  $stateProvider.state('treebank.query.index', {
    url: '',
    /**
     * @param {angular.ui.IStateService} $state
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {angular.ITimeoutService} $timeout
     * @param {QueryParams} queryParams
     */
    onEnter: function ($state, $stateParams, $timeout, queryParams) {
      $timeout(function () {
        if (queryParams.query && _.isEmpty($stateParams.query)) {
          const stateParamsClone = {...$stateParams, query: queryParams.query};
          $state.go($state.current.name, stateParamsClone, {location: 'replace'});
        }
      });
    }
  });


  $stateProvider.state('treebank.queryfile', {
    url: '/queryfile/{fileID}?{queryID}&{userID}',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    title: 'QueryFile',
    abstract: true,
    params: {
      fileID: {squash: false, value: null},
      queryID: {squash: false, value: null},
      userID: {squash: false, value: null}
    }
  });

  $stateProvider.state('treebank.queryfile.index', {
    url: '',
    /**
     * @param {angular.ui.IStateService} $state
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {angular.ITimeoutService} $timeout
     * @param {QueryParams} queryParams
     */
    onEnter: function ($state, $stateParams, $timeout, queryFileParams) {
      /* TODO
      $timeout(function () {
        if (queryParams.query && _.isEmpty($stateParams.query)) {
          $stateParams.query = queryParams.query;
          $state.go($state.current.name, $stateParams, {location: 'replace'});
        }
      });
      */
    }
  });
};
