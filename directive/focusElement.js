angular.module('pmltqWeb').directive('focusElement', function($document) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, fn) {
      $(element).focus();
      $document.scrollTopAnimated();
		}
	};
});
