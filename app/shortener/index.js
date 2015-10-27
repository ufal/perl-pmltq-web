var angular = require('angular');

module.exports = angular.module('pmltq.shortener', [require('../shared')])
  .directive({
    focusUrl: require('./directives/focusUrl'),
    shortenUrl: require('./directives/shortenUrl')
  })
  .factory('shortenerModal', require('./modal'))
  .factory('shortener', require('./api'))
  .name;
