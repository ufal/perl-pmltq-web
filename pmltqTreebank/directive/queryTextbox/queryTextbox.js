angular.module('pmltqTreebank').directive('queryTextbox', function() {
  return {
    restrict: 'A',
    scope: {
      query:    '=queryTextbox',
      treebank: '=*?',
      params:   '=*?',
      result:   '=*?queryResult'
    },
    templateUrl: 'pmltqTreebank/directive/queryTextbox/queryTextbox.html',
    link: function($scope, $element, $attrs) {

      $scope.submit = function(queryData) {
        var result = $scope.result,
            treebank = $scope.treebank;
        if (!result || !treebank) {
          return;
        }

        result.submit(treebank, queryData);
      };
    }
  };
});
