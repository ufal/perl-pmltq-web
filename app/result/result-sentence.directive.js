angular.module('pmltq.result').directive('resultSentence', function() {
  return {
    restrict: 'A',
    scope: {
      sentence: '=resultSentence'
    },
    templateUrl: 'pmltq.result/directive/resultSentence/resultSentence.html',
    link: function($scope, element, attrs, fn) {


    }
  };
});
