angular.module('pmltq.treebank').config(function($stateProvider) {

  $stateProvider.state('treebank', {
    url: '/treebank/:treebankId',
    templateUrl: 'treebank/treebank.html',
    controller: 'TreebankController',
    title: '{{treebank.title}}',
    abstract: true,
    resolve: {
      treebank: function(treebankApi, $stateParams) {
        return treebankApi.one($stateParams.treebankId).get();
      },
      result: function(resultHolder) {
        return resultHolder();
      },
      history: function(historyApi) {
        return historyApi.getList();
      },
      queryParams: function (QueryParams, $stateParams) {
        return new QueryParams($stateParams.treebankId);
      }
    }
  });

  //noinspection JSUnusedGlobalSymbols
  $stateProvider.state('treebank.index', {
    url: '',
    onEnter: function($state, $stateParams, $timeout, history) {
      $timeout(function () {
        if (history.length === 0) {
          $state.go('treebank.help', $stateParams, {location: 'replace'});
        } else {
          $state.go('treebank.query.index', $stateParams, {location: 'replace'});
        }
      });
    }
  });

  $stateProvider.state('browse', {
    url: '/treebanks',
    controller: 'BrowseTreebanksController',
    controllerAs: 'vm',
    templateUrl: 'treebank/browse.html',
    title: 'Browse Treebanks',
    resolve: {
      treebanksList: function(treebankApi) {
        return treebankApi.getList();
      }
    }
  });
});
