var angular = require('angular');

module.exports = angular.module('pmltq.treebank',
  [
    require('../shared'),
    require('../api'),
    require('../history'),
    require('../query'),
    require('../help')
  ])
  .config(require('./routes'))
  .directive({
    languageIcon: require('./directives/languageIcon'),
    treebankImage: require('./directives/treebankImage'),
    treebankListItem: require('./directives/treebankListItem')
  })
  .name;