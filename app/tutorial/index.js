var angular = require('angular');

module.exports = angular.module('pmltq.tutorial', [require('../shared'), require('../query')])
  .config(require('./routes'))
  .directive({
     queryTutorial: require('./directives/queryTutorial')
  })
  .name;