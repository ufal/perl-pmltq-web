angular.module('pmltqTreebank').directive('matchedNodes', function() {
	return {
		restrict: 'A',
		scope: {
      result: '=matchedNodes'
		},
		templateUrl: 'pmltqTreebank/directive/matchedNodes/matchedNodes.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
