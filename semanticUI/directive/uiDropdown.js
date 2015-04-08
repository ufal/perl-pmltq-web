angular.module('semanticUI').directive('uiDropdown', function($timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    replace: true,
    scope: {
      items: '=uiDropdown',
      title: '@'
    },
    template: '<div>' +
                '<span ng-bind="title"></span> ' +
                '<div class="default text" ng-bind="selected"></div>' +
                '<i class="dropdown icon"></i>' +
                '<div class="menu">' +
                  '<div class="item" ng-repeat="item in items" data-value="{{$index}}" ng-bind="item"></div>' +
                '</div>' +
              '</div>',
    link: function($scope, $element, $attrs, ngModelCtrl) {
      $element.dropdown({
        onChange: function(value, text) {
          $scope.$apply(function() {
            $scope.selected = $scope.items[value];
          });
        }
      });

      if (ngModelCtrl) {
        ngModelCtrl.$render = function() {
          $scope.selected = ngModelCtrl.$modelValue;
          $timeout(function() {
            var index = $scope.items.indexOf($scope.selected);
            if (index >= 0) {
              $element.dropdown('set selected', index);
            }
          });
        };

        $scope.$watch('selected', function(value) {
          ngModelCtrl.$setViewValue(value);
        });
      }
    }
  };
}).filter('itemize', function() {
  return function(items) {
    var filtered = [];
    for (var i = 0, ii = items.length; i < ii; i++) {
      var item = items[i];
      if (!angular.isObject(item)) {
        item = { value: item, title: item };
      }
      filtered.push(item);
    }
    return filtered;
  };
});
