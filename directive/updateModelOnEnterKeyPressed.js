angular.module('pmltqWeb').directive('updateModelOnEnterKeyPressed', function() {
	return {
		restrict: 'A',
    require: 'ngModel',
		link: function($scope, $element, $attrs, ngModel) {
      $element.bind('keyup', function(e) {
        if (e.keyCode == 13) {
          ngModel.$commitViewValue();
        }
      });
		}
	};
});
