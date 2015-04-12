angular.module('pmltq.result').directive('resultSentence', function() {
  return {
    restrict: 'A',
    scope: {
      sentence: '=resultSentence'
    },
    templateUrl: 'result/result-sentence.directive.html',
    link: function($scope, element, attrs, fn) {


    }
  };
});
