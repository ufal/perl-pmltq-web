angular.module('pmltqWeb', ['ui.router', 'restangular', 'duScroll', 'angular-loading-bar', 'pmltqTreebank', 'pmltqHelp', 'pmltqHistory', 'semanticUI']);

angular.module('pmltqWeb').config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('/api');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'partial/home/home.html'
  });

  $stateProvider.state('treebank', {
    url: '/treebank/:treebankId',
    templateUrl: 'partial/treebank/treebank.html',
    controller: 'TreebankController',
    abstract: true,
    resolve: {
      treebank: ['treebanksApi', '$stateParams', function(treebanksApi, $stateParams) {
        return treebanksApi.one($stateParams.treebankId).get();
      }],
      history: ['historyApi', function(historyApi) {
        return historyApi.getList();
      }]
    }
  });

  $stateProvider.state('treebank.index', {
    url: '',
    controller: ['$state', 'history', function($state, history) {
      if (history.length === 0) {
        $state.go('treebank.help');
      } else {
        $state.go('treebank.query.index');
      }
    }]
  });

  $stateProvider.state('browse', {
    url: '/treebanks',
    templateUrl: 'partial/browse/browse.html'
  });

  $stateProvider.state('treebank.query', {
    url: '/query/:query',
    abstract: true,
    templateUrl: 'partial/query/query.html'
  });

  $stateProvider.state('treebank.query.index', {
    url: '',
    controller: ['$scope', '$state', function($scope, $state) {
      if ($scope.result && !$scope.result.isEmpty) {
        $state.go('treebank.query.result');
      }
    }]
  });

  $stateProvider.state('treebank.query.result', {
    url: '/result',
    templateUrl: 'partial/result/result.html'
  });

  $stateProvider.state('treebank.suggest', {
    url: '/suggest',
    templateUrl: 'partial/suggest/suggest.html'
  });
  $stateProvider.state('treebank.history', {
    url: '/history',
    templateUrl: 'partial/history/history.html'
  });
  $stateProvider.state('treebank.help', {
    url: '/help',
    templateUrl: 'partial/help/help.html'
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

});

// $(function() {
//   $(window).bind("load resize", function() {
//     height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
//     if (height < 1) height = 1;
//     $("#page-wrapper").css("min-height", (height) + "px");
//   });
// });
