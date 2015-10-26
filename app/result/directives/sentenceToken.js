require('./sentenceToken.less');

module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      token: '=sentenceToken'
    },
    replace: true,
    template:
      `<span
        class="sentence-token"
        ng-bind="token.text"
        ng-class="token.classes"
        ng-style="token.style"></span>`,
    link: function($scope, $element) {
      var token = $scope.token;

      $element.on('click', function () {
        token.animateNodes();
      });
    }
  };
};
