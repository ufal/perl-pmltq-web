angular.module('pmltq.result').directive('matchedNodes', function() {
	return {
		restrict: 'A',
		scope: {
      result: '=matchedNodes'
		},
		templateUrl: 'result/matched-nodes.directive.html'
		link: function(scope, element, attrs, fn) {


		}
	};
});
