angular.module('pmltqWeb', ['mgcrea.ngStrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular', 'duScroll', 'angular-loading-bar', 'pmltqTreebank', 'pmltqHelp', 'pmltqHistory']);

angular.module('pmltqWeb').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('/api');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'partial/home/home.html'
  });
  $stateProvider.state('treebank', {
    url: '/treebank/:treebank',
    templateUrl: 'partial/treebank/treebank.html'
  });
  $stateProvider.state('browse', {
    url: '/treebanks',
    templateUrl: 'partial/browse/browse.html'
  });
  /* Add New States Above */
  $urlRouterProvider.otherwise('/home');

});

angular.module('pmltqWeb')
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

})
.constant('$', jQuery); // have jquery as a service

// $(function() {
//   $(window).bind("load resize", function() {
//     height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
//     if (height < 1) height = 1;
//     $("#page-wrapper").css("min-height", (height) + "px");
//   });
// });
