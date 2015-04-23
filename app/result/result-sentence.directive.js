angular.module('pmltq.result').directive('resultSentence', function() {
  return {
    restrict: 'A',
    scope: {
      sentence: '=resultSentence'
    },
    template:

'<p class="result-sentence"><span ng-repeat="token in sentence" sentence-token="token"></span></p>',

    controller: 'ResultSentenceController'
  };
});
