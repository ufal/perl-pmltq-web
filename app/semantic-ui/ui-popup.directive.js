angular.module('semanticUI').directive('uiPopup', function() {
  return {
    restrict: 'A',
    scope: {
      options: '=?uiPopup'
    },
    link: function($scope, $element, $attrs) {
      $scope.$watch('options', function(options) {
        if (angular.isUndefined(options) || options === $attrs['uiPopup']) {
          options = {};
        }
        $($element).popup(options);
      });
    }
  };
});
