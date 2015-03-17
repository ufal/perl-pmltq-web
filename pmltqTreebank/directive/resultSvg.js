angular.module('pmltqTreebank').directive('resultSvg', function() {
	return {
		restrict: 'A',
    require: '^treebankDetail',
		link: function($scope, $element, $attrs, treebankDetail, $http) {
      $scope.$on('result.changed', function (e, result, resultNo) {
        if (resultNo > 0) {
          console.log(result);
          treebankDetail.getTreebank().post('svg', {
            nodes: result,
            tree_no: 0
          }).then(function(response) {
            $element.html(response);
          });
        } else {
          $element.empty();
        }
      });

		}
	};
});
