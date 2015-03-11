angular.module('pmltqTreebank').directive('treebankBox', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '='
    },
    templateUrl: 'pmltqTreebank/directive/treebankBox/treebankBox.html',
    link: function(scope, element, attrs) {
      if (scope.treebank && scope.treebank.title) {
        scope.firstLetter = scope.treebank.title.substr(0, 1).toUpperCase();
      }
    }
  };
});
