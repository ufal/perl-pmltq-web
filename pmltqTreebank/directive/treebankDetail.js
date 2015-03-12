angular.module('pmltqTreebank').directive('treebankDetail', function() {
  return {
    restrict: 'E',
    scope: {
      treebank: '=tb'
    },
    transclude: true,
    replace: true,
    bindToController: true,
    controllerAs: 'treebankDetail',
    template: '<div class="treebank-detail" ng-transclude></div>',
    // Only hold treebank instance in the controller
    controller: function TreebankDetailController($scope) {
      var ctrl = this;
      ctrl.broadcast = $scope.$broadcast;
      ctrl.getTreebank = function() {
        if (!ctrl.treebank) {
          throw new Error('Treebank is not defined');
        }

        return ctrl.treebank;
      };
    }
  };
});
