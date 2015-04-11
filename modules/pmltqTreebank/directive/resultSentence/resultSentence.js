angular.module('pmltqTreebank').directive('resultSentence', function() {
  return {
    restrict: 'A',
    scope: {
      sentence: '=resultSentence'
    },
    templateUrl: 'pmltqTreebank/directive/resultSentence/resultSentence.html',
    link: function($scope, element, attrs, fn) {


    }
  };
});
