var angular = require('angular');

module.exports = function($interpolate, $state, $document, $timeout) {
  'ngInject';

  function interpolateName(state) {
    if (state.filename) {
      var context = angular.isUndefined(state.locals) ? state : state.locals.globals;
      return $interpolate(state.filename)(context);
    }

    return false;
  }

  function getTitles(defaultTitle) {
    var currentState = $state.$current,
      title = [];

    while (currentState && currentState.name) {
      var displayTitle = interpolateName(currentState);
      if (displayTitle) {
        title.push(displayTitle);
      }

      currentState = currentState.parent;
    }

    title.reverse();
    title.push(defaultTitle);
    return title;
  }

  return {
    restrict: 'E',
    link: function($scope, $element) {
      var defaultTitle = $element.text() || 'PML Tree Query';

      $scope.$on('$stateChangeSuccess', function() {
        $timeout(function() {
          var title = getTitles(defaultTitle).join(' | ');
          $element.text(title);
          $document.title = title;
        });
      });
    }
  };
};
