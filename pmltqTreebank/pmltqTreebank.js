angular.module('pmltqTreebank', ['mgcrea.ngStrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular']);

angular.module('pmltqTreebank').config(function($stateProvider) {

    /* Add New States Above */
})
.provider('constants', function constantsProvider() {
  function extractTo(where) {
    for (var c in constants) {
      if (constants.hasOwnProperty(c) && 'function' !== typeof constants[c]) {
        where[c] = constants[c];
      }
    }
  }

  var constants = {
    STATE_LOADING:     'loading',
    STATE_SUCCESS:     'success',
    STATE_ERROR:       'error',
    RESULT_TYPE_NODES: 'nodes',
    RESULT_TYPE_TABLE: 'table',
    extractTo: extractTo
  };

  this.setConstants = function(consts) {
    angular.extend(constants, consts);
  };

  this.$get = function() {
    return constants;
  };

})
.constant('$', jQuery) // have jquery as a service
.constant('_', _.runInContext()); // have lodash as a service;

