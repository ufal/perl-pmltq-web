angular.module('pmltqHelp').directive('treebankHelp', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      metadata: '=tb'
    },
    templateUrl: 'pmltqHelp/treebank/treebankHelp.html'
  };
});
