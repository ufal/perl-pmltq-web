var angular = require('angular');

module.exports = angular.module('pmltq.help', [require('../shared'), require('../query')])
  .config(require('./routes'))
  .directive({
    queryExample: require('./directives/queryExample'),
    treebankHelp: require('./directives/treebankHelp'),
    treebankCustomHelp: require('./directives/treebankCustomHelp')
  })
  .name;
