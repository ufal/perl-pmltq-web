require('./fileControls.less');

module.exports = function () {

  return {
    restrict: 'A',
    require: '^svgView',
    scope: {},
    template: require('./fileControls.jade'),
    link: function ($scope, $element, $attrs, svgView) {
      var subscribe = svgView.file
        .safeApply($scope, (svgFile) => $scope.file = svgFile)
        .subscribe();

      // check if this is way to do it
      $scope.$on('$destroy', function () {
        subscribe.dispose();
      });
    }
  };
};
