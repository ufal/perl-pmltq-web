angular.module('pmltq.query').directive('querySuggest', function() {
  return {
    restrict: 'A',
    scope: {
      treebank: '=suggest',
      ids:      '=',
      vars:     '=?'
    },
    templateUrl: 'query/query-suggest.directive.html',
    link: function($scope) {
      $scope.$watchGroup(['ids', 'vars'], function() {
        var treebank = $scope.treebank,
            ids = $scope.ids,
            vars = $scope.vars;

        treebank.post('suggest', {
          ids: ids,
          vars: vars
        }).then(function () {
          console.log(arguments);
        });
      });
    }
  };
});
