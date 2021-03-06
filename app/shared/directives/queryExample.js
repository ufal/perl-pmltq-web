require('./queryExample.less');

module.exports = function($interpolate) {
  'ngInject';

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      treebank: '=',
      title: '=',
      queryrecord: '=',
      hideUse: '='
    },
    template: require('./queryExample.jade'),
    link: function ($scope, $element, $attr, $controller, $transclude) {
      $scope.hideUse = !!$scope.hideUse;

      if(! $scope.title) {
        $scope.title = "Try query";
      }
      $transclude(function (clone, tScope) {
        var queryText = clone.filter(function () {
          return this.nodeType !== 3;
        }).text();
        $scope.query = $interpolate(queryText)(tScope);
        // TODO resize minimized readonly editor
      });
    }
  };
};
