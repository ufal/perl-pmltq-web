angular.module('pmltq.query').directive('queryForm', function(QueryParams, Suggest, localStorageService, _) {
  var suggestHelpKey = 'suggest-hide-help';

  return {
    restrict: 'A',
    scope: {
      treebank: '=queryForm',
      params:   '=*?',
      result:   '=*?queryResult'
    },
    templateUrl: 'query/query-form.directive.html',
    link: function($scope) {
      if (!$scope.params) {
        // Save default params as they are changed
        $scope.params = new QueryParams($scope.treebank.id);
      }

      $scope.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      $scope.limitSelect = [1, 10, 100, 1000, 10000];

      $scope.submit = function(queryParams) {
        var result = $scope.result;
        if (!result) {
          return;
        }

        result.submit($scope.treebank, queryParams);
      };

      $scope.showHelp = !localStorageService.get(suggestHelpKey);

      $scope.hideHelp = function() {
        localStorageService.set(suggestHelpKey, true);
        $scope.showHelp = false;
      };

      $scope.suggest = function(basedOn) {
        if (!basedOn) { return; }
        if (!_.isArray(basedOn)) { basedOn = [basedOn]; }
        return $scope.treebank.post('suggest', {ids: basedOn}).then(function(data) {
          $scope.suggestObj = new Suggest(data.query);
        });
      };
    }
  };
});
