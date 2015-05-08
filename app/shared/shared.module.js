angular.module('pmltq.shared', [
  'angular-loading-bar',
  'duScroll',
  'LocalStorageModule',
  'restangular',
  'semanticUI',
  'ui.router'
]);

angular.module('pmltq.shared').run(function ($rootScope) {
  $rootScope.$safeApply = function() {
    var $scope, fn, force = false;
    if (arguments.length === 1) {
      var arg = arguments[0];
      if (typeof arg === 'function') {
        fn = arg;
      }
      else {
        $scope = arg;
      }
    } else {
      $scope = arguments[0];
      fn = arguments[1];
      if (arguments.length === 3) {
        force = !!arguments[2];
      }
    }
    $scope = $scope || this;
    fn = fn || function() { };
    if (force || !$scope.$$phase) {
      if ($scope.$apply) {
        $scope.$apply(fn);
      } else {
        $scope.apply(fn);
      }
    } else {
      fn();
    }
  };
});

angular.module('pmltq.shared')
// TODO: Refactor - Move to separate module
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

  //noinspection JSUnusedGlobalSymbols
    this.setConstants = function(consts) {
    angular.extend(constants, consts);
  };

  //noinspection JSUnusedGlobalSymbols
    this.$get = function() {
    return constants;
  };

})
.constant('$', jQuery) // have jquery as a service
.constant('_', _.runInContext()) // have lodash as a service;
.constant('Snap', Snap);

