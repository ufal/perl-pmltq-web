angular.module('pmltq.treebank').config(function($stateProvider) {

  $stateProvider.state('treebank', {
    url: '/treebank/:treebankId',
    templateUrl: 'treebank/treebank.html',
    controller: 'TreebankController',
    abstract: true,
    resolve: {
      treebank: function(treebanksApi, $stateParams) {
        return treebanksApi.one($stateParams.treebankId).get();
      },
      result: function(resultHolder) {
        return resultHolder();
      },
      history: function(historyApi) {
        return historyApi.getList();
      },
      queryParams: function (QueryParams) {
        return new QueryParams(
          "t-node [ gram/deontmod ~ '(deb|hrt|vol|perm|poss|fac)', a/lex.rf a-node [] ];",
          100,
          30
        );
      }
    }
  });

  $stateProvider.state('treebank.index', {
    url: '',
    controller: function($state, history) {
      if (history.length === 0) {
        $state.go('treebank.help');
      } else {
        $state.go('treebank.query.index');
      }
    }
  });

  $stateProvider.state('browse', {
    url: '/treebanks',
    controller: 'BrowseTreebanksController',
    controllerAs: 'vm',
    templateUrl: 'treebank/browse.html',
    resolve: {
      treebanksList: function(treebanksApi) {
        return treebanksApi.getList();
      }
    }
  });
});
