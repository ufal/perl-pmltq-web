var angular = require('angular');

require('./index.less');

module.exports = angular.module('pmltq.home', [require('../shared'), require('../auth'), require('../treebank')])
  .config(require('./routes'))
  .name;
