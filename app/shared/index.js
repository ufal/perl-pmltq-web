var angular = require('angular');
var $ = require('jquery');
require('jquery-ui-bundle');

require('angular-loading-bar');
require('angular-scroll');
require('angular-local-storage');
require('restangular');
require('snapsvg');
require('rx-angular');
require('angular-ui-sortable');

module.exports = angular.module('pmltq.shared', [
  'angular-loading-bar',
  'duScroll',
  'LocalStorageModule',
  'restangular',
  //require('rx-angular/index'),
  'rx',
  'ui.sortable',
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
    transcludeSelect: require('./directives/transcludeSelect'),
    queryExample: require('./directives/queryExample'),
    logoImage: require('./directives/logoImage'),
    markdownView: require('./directives/markdownView')
  })
  .factory('promptModal', require('./prompt'))
  .name;

