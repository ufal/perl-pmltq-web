angular.module('pmltq', [
  'pmltq.shared',

  // modules
  'pmltq.help',
  'pmltq.history',
  'pmltq.home',
  'pmltq.query',
  'pmltq.result',
  'pmltq.treebank'
]);

angular.module('pmltq').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('/api');

  $urlRouterProvider.otherwise('/home');
});

angular.module('pmltq')
.run(function($rootScope) {

  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});
