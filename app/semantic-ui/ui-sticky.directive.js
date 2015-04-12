angular.module('semanticUI').directive('uiSticky', function() {
  return {
    restrict: 'A',
    scope: {
      options: '=?uiSticky'
    },
    link: function($scope, $element, $attrs) {
      $scope.$watch('options', function(options) {
        if (angular.isUndefined(options) || options === $attrs.uiSticky) {
          options = {};
        }
        $($element).sticky(options);
      });
    }
  };
});
