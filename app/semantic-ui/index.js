var angular = require('angular');

require('semantic-ui-dimmer/dimmer');
require('semantic-ui-dropdown/dropdown');
require('semantic-ui-transition/transition');
require('semantic-ui-modal/modal');
require('semantic-ui-popup/popup');
require('semantic-ui-sticky/sticky');

module.exports = angular.module('semanticUI', [])
  .directive({
    checkbox: require('./directives/checkbox'),
    uiDropdown: require('./directives/dropdown'),
    uiPopup: require('./directives/popup'),
    uiSelectbox: require('./directives/selectbox'),
    uiSticky: require('./directives/sticky')
  })
  .factory('uiModal', require('./modal'))
  .factory('uiUtils', require('./utils'))
  .name;

