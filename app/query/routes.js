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
    is: (val) => val && typeof val === 'string' && val.length && !decompressQuery(val)
  });

  $stateProvider.state('treebank.query', {
    url: '/query/{query:compressed}',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    abstract: true,
    params: {
      query: {squash: false, value: null}
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
        if (queryParams.present() && _.isEmpty($stateParams.query)) {
          $stateParams.query = queryParams.query;
          $state.go($state.current.name, $stateParams, {location: 'replace'});
        }
      });
    }
  });
};
