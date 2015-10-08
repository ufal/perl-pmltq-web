var angular = require('angular');

module.exports = angular.module('pmltq.suggest', [require('../shared')])
  .config(require('./routes'))
  .factory('SuggestItem', require('./suggestItem'))
  .factory('Suggest', require('./suggest'))
  .directive({
    suggestQuery: require('./directives/suggestQuery')
  })
  .name;

