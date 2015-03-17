angular.module('pmltqTreebank').directive('queryForm', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    require: ['^treebankDetail', 'queryForm'],
    templateUrl: 'pmltqTreebank/directive/queryForm/queryForm.html',
    controllerAs: 'queryForm',
    controller: function QueryFormController() {
      var ctrl = this;

      ctrl.setResults = function(nodes, results) {
        this.nodes = nodes;
        this.results = results;
        this.resultsCount = results.length;
        this.currentResult = this.resultsCount > 0 ? 1 : 0;
      };

      ctrl.nextResult = function() {
        if (this.currentResult < this.resultsCount) {
          this.currentResult++;
        }
      };

      ctrl.prevResult = function() {
        if (this.currentResult > 1) {
          this.currentResult--;
        }
      };

      ctrl.hasResult = function() {
        return this.resultsCount > 0;
      };
    },
    link: function($scope, $element, $attrs, controllers) {
      var treebankDetail = controllers[0],
          queryForm = controllers[1];

      $scope.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      $scope.limitSelect = [1, 10, 100, 1000, 10000];

      // Save default params as they are changed
      $scope.params = {
        timeout: 30,
        limit: 100
      };

      $scope.submit = function(queryData) {
        treebankDetail.broadcast('query.submited', queryData);

        treebankDetail.getTreebank().post('query', queryData).then(function (successResponse) {
          treebankDetail.broadcast('query.results', successResponse.nodes, successResponse.results);
          queryForm.setResults(successResponse.nodes, successResponse.results);
        }, function (errorResponse) {
          treebankDetail.broadcast('query.error', errorResponse);
        });
      };
    }
  };
});
