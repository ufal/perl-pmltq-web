angular.module('pmltqTreebank').directive('queryForm', function() {
  var RESULT_TYPE_SVG = 'svg',
      RESULT_TYPE_TABLE = 'table';

  return {
    restrict: 'E',
    replace: true,
    scope: {},
    require: ['^treebankDetail', 'queryForm'],
    templateUrl: 'pmltqTreebank/directive/queryForm/queryForm.html',
    controllerAs: 'queryForm',
    controller: function QueryFormController($element) {
      var ctrl = this;

      var treebankDetail = $element.controller('treebankDetail');
      ctrl.setResults = function(nodes, results) {
        ctrl.nodes = nodes;
        ctrl.resultType = angular.isDefined(nodes) ? RESULT_TYPE_SVG : RESULT_TYPE_TABLE;
        treebankDetail.notify('result.type', ctrl.resultType) // signal result type to prepare view

        ctrl.results = results;
        ctrl.resultsCount = results.length;
        ctrl.setCurrentResult(ctrl.resultsCount > 0 ? 1 : 0);
      };

      ctrl.nextResult = function() {
        ctrl.setCurrentResult(ctrl.currentResultNo+1);
      };

      ctrl.nextResult.canExecute = function() {
        return ctrl.currentResultNo < ctrl.resultsCount;
      };

      ctrl.prevResult = function() {
        ctrl.setCurrentResult(ctrl.currentResultNo-1);
      };

      ctrl.prevResult.canExecute = function() {
        return ctrl.currentResultNo > 1;
      };

      ctrl.hasResult = function() {
        return ctrl.resultsCount > 0;
      };

      ctrl.setCurrentResult = function(resultNo) {
        if (resultNo > 0 && resultNo <= ctrl.resultsCount) {
          ctrl.currentResultNo = resultNo;
          ctrl.currentResult = ctrl.results[resultNo-1];
        } else {
          ctrl.currentResultNo = 0;
          ctrl.currentResult = [];
        }

        switch (ctrl.resultType) {
          case RESULT_TYPE_SVG:
            treebankDetail.notify('result.' + RESULT_TYPE_SVG, ctrl.currentResult, ctrl.currentResultNo);
            break;
          case RESULT_TYPE_TABLE:
            treebankDetail.notify('result.' + RESULT_TYPE_TABLE, ctrl.results);
            break;
        }
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
        limit: 100,
        query: 'a-root []'
      };

      $scope.submit = function(queryData) {
        treebankDetail.notify('query.submited', queryData);

        treebankDetail.getTreebank().post('query', queryData).then(function (successResponse) {
          treebankDetail.notify('query.results', successResponse.nodes, successResponse.results);
          queryForm.setResults(successResponse.nodes, successResponse.results);
        }, function (errorResponse) {
          treebankDetail.notify('query.error', errorResponse);
        });
      };
    }
  };
});
