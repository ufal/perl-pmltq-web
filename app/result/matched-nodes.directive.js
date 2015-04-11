angular.module('pmltq.result').directive('matchedNodes', function() {
	return {
		restrict: 'A',
		scope: {
      result: '=matchedNodes'
		},
		templateUrl: 'pmltq.result/directive/matchedNodes/matchedNodes.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
