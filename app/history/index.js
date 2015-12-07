var angular = require('angular');

module.exports = angular.module('pmltq.history', [require('../shared'), require('../auth'), require('../api')])
  .config(require('./routes'))
  .name;
