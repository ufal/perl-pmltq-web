require('./queryExample.less');

module.exports = function($interpolate) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      treebank: '='
    },
    template: require('./queryExample.jade'),
    link: function ($scope, $element, $attr, $controller, $transclude) {
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
