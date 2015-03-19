angular.module('pmltqTreebank').directive('queryForm', function() {
  var RESULT_TYPE_SVG = 'svg',
      RESULT_TYPE_TABLE = 'table';

  return {
    restrict: 'A',
    scope: {
      treebank: '=queryForm'
    },
    require: '^treebankDetail',
    templateUrl: 'pmltqTreebank/directive/queryForm/queryForm.html',
    controllerAs: 'queryForm',
    link: function($scope, $element, $attrs, treebankDetail) {
      $scope.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      $scope.limitSelect = [1, 10, 100, 1000, 10000];

      // Save default params as they are changed
      $scope.params = {
        timeout: 30,
        limit: 100,
        query: 'a-root []'
      };

      $scope.submit = function(queryData) {
        treebankDetail.notify('query.submited', queryData);

        treebankDetail.getTreebank().post('query', queryData).then(function (res) {
          treebankDetail.notify('query.results', res);
        }, function (err) {
          treebankDetail.notify('query.error', err);
        });
      };
    }
  };
});
