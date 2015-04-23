angular.module('pmltq.result').directive('sentenceToken', function($) {
  return {
    restrict: 'A',
    scope: {
      token: '=sentenceToken'
    },
    require: '^resultSentence',
    replace: true,
    template:

'<span class="sentence-token" ng-bind="token.text" ng-class="token.classes" ng-style="token.style"></span>',

    link: function($scope, $element, $attrs, sentenceController) {

      $($element).bind({
        click: function() {

        }
      });
    }
  };
});
