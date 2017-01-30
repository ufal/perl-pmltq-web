var angular = require('angular');

module.exports = angular.module('pmltq.browse', [require('../shared'), require('../api'), require('../treebank'), require('../auth')])
  .factory('treebanksFilter', require('./treebankFilter'))
  .config(require('./routes'))
  .name;
