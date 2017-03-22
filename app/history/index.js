var angular = require('angular');

module.exports = angular.module('pmltq.history', [require('../shared'), require('../auth'), require('../api'), require('../query')])
  .config(require('./routes'))
  .name;
