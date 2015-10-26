module.exports = function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {},
    template: `
    <div class="result-sentence">
      <span ng-repeat="token in sentence" sentence-token="token"></span>
    </div>`,
    require: '^svgView',
    link: function ($scope, $element, $attrs, svgView) {
      var subscribe = svgView.trees
        .pluck('sentence')
        //.digest($scope, 'sentence')
        .safeApply($scope, (sentence) => $scope.sentence = sentence)
        .subscribe((sentence) => {
          sentence.nodeHover
            .safeApply($scope, (ev) => {
              if (ev.type === 'mouseenter') {
                sentence.highlightTokens(ev.data.nodeId);
              } else {
                sentence.clearHighlight();
              }
            })
            .subscribe();
        });

      // check if this is way to do it
      $scope.$on('$destroy', function () {
        subscribe.dispose();
      });
    }
  };
};
