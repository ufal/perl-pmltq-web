module.exports = function SuggestController($scope, $state, treebank, suggest, result, localStorageService) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  var storageKey = 'suggest-hide-help';

  $scope.suggest = suggest;
  $scope.result = result;
  $scope.showHelp = !localStorageService.get(storageKey);

  $scope.hideHelp = function () {
    localStorageService.set(storageKey, true);
    $scope.showHelp = false;
  };

  $scope.append = function () {

  };

  $scope.submit = function () {
    result.submit(treebank, {query: suggest.query()});
    $state.go('treebank.query.index');
  };
};
