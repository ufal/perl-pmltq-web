angular.module('pmltq.result').directive('sentence', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      sentence: '='
    },
    template:

'<div class="result-sentence"><span ng-repeat="token in sentence" sentence-token="token"></span></div>',

    controller: 'SentenceController'
  };
});
