var angular = require('angular');

module.exports = function ($timeout) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  return {
    restrict: 'A',
    scope: {
      options: '=?uiSticky'
    },
    link: function($scope, $element, $attrs) {
      $scope.$watch('options', function(options) {
        if (angular.isUndefined(options) || options === $attrs.uiSticky) {
          options = {};
        }
        $timeout(function () {
          $element.sticky(options);
        });
      });
    }
  };
};
