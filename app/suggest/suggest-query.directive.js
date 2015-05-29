angular.module('pmltq.suggest').directive('suggestQuery', function() {

  return {
    restrict: 'A',
    scope: {
      suggest: '=suggestQuery'
    },
    templateUrl: 'suggest/suggest-query.directive.html'
  };
});
