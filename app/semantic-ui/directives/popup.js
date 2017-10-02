var angular = require('angular');
/** @type _ */
var _ = require('lodash');

module.exports = function () {
  return {
    restrict: 'A',
    scope: {
      options: '=?uiPopup'
    },
    link: function($scope, $element, $attrs) {
      $scope.$watch('options', function(options) {
        if (!_.isPlainObject(options)) {
          options = {};
        }
        options.inline = true;
        $element.popup(options);
      });

      $scope.$on('destroy', function () {
        var popup = $element.data('module-popup');
        if (popup) {
          popup.destroy();
        }
      });
    }
  };
};
