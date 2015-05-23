angular.module('semanticUI').directive('nag', function() {
  return {
    restrict: 'C',
    link: function($scope, $element) {
      $element.nag();
    }
  };
});
