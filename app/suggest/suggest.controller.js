angular.module('pmltq.suggest').controller('SuggestController', function($scope, suggest, result, localStorageService) {
  var storageKey = 'suggest-hide-help';

  $scope.suggest = suggest;
  $scope.result = result;
  $scope.showHelp = !localStorageService.get(storageKey);

  $scope.hideHelp = function () {
    localStorageService.set(storageKey, true);
    $scope.showHelp = false;
  };
});
