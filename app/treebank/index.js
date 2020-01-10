var angular = require('angular');

module.exports = angular.module('pmltq.treebank',
  [
    require('../shared'),
    require('../api'),
    require('../myquery'),
    require('../tutorial'),
    require('../query'),
    require('../help')
  ])
  .config(require('./routes'))
  .directive({
    languageIcon: require('./directives/languageIcon'),
    treebankListItem: require('./directives/treebankListItem')
  })
  .name;
