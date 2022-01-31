module.exports = function($timeout) {
  'ngInject';

  return {
    restrict: 'A',
    require: '?ngModel',
    replace: true,
    transclude: true,
    scope: {
      items: '=uiSelectbox',
      menutitle: '@',
      valuekey: '@'
    },
    template: require('./selectbox.jade'),
    link: function($scope, $element, $attrs, ngModelCtrl) {
      $element.dropdown({
        onChange: function(value) {
          $scope.$apply(function() {
            $scope.selected = $scope.items[value];
          });
        }
      });

      if (ngModelCtrl) {
        ngModelCtrl.$render = function() {
          $scope.selected = ngModelCtrl.$modelValue;
          $timeout(function() {
            if($scope.items){
              var index = $scope.items.indexOf($scope.selected);
              if (index >= 0) {
                $element.dropdown('set selected', index);
              }
            }
          });
        };

        $scope.$watch('selected', function(value) {
          ngModelCtrl.$setViewValue(value);
        });
      }
    }
  };
};
