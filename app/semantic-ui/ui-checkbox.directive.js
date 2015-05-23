angular.module('semanticUI').directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: function(tElement, tAttrs) {
      var type = tAttrs.type || '';

      return '<div class="ui' + (type ? ' ' + type : '') + ' checkbox" ng-transclude></div>';
    },
    link: function ($scope, $element) {
      // TODO: sync ng-model
    }
  };
});
