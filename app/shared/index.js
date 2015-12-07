var angular = require('angular');

require('angular-loading-bar');
require('angular-scroll');
require('angular-local-storage');
require('restangular');
require('snapsvg');

module.exports = angular.module('pmltq.shared', [
  'angular-loading-bar',
  'duScroll',
  'LocalStorageModule',
  'restangular',
  require('rx-angular/index'),
  require('angular-ui-router'),
  require('../semantic-ui'),
  require('../auth')
])
  .config(require('./routes'))
  .directive({
    focusElement: require('./directives/focusElement'),
    navigation: require('./directives/navigation'),
    title: require('./directives/title'),
    updateModelOnEnterKeyPressed: require('./directives/updateOnKeyPressed'),
    transcludeSelect: require('./directives/transcludeSelect')
  })
  .factory('promptModal', require('./prompt'))
  .name;

