angular.module('semanticUI').directive('uiDropdown', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $timeout(function () {
        $element.dropdown();
      });
    }
  };
});
