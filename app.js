angular.module('pmltqWeb', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular', 'history']);

angular.module('pmltqWeb').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('/api');

  $stateProvider.state('search', {
    url: '/home',
    templateUrl: 'partial/home/home.html'
  });
  /* Add New States Above */
  $urlRouterProvider.otherwise('/home');

});

angular.module('pmltqWeb').run(function($rootScope) {

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

// $(function() {
//   $(window).bind("load resize", function() {
//     height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
//     if (height < 1) height = 1;
//     $("#page-wrapper").css("min-height", (height) + "px");
//   });
// });
