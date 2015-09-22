angular.module('pmltq.treebank').directive('languageIcon', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      code: '=languageIcon'
    },
    templateUrl: 'treebank/language-icon.directive.html'
  };
});
