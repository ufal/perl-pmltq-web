var angular = require('angular');

module.exports = angular.module('pmltq.query', [
  require('../shared'),
  require('../api'),
  require('../result'),
  require('../suggest'),
  require('../shortener')
])
  .config(require('./routes'))
  .factory('QueryParams', require('./queryParams'))
  .factory('pmltqModeBuilder', require('./pmltqModeBuilder'))
  .directive({
    queryEditor: require('./directives/queryEditor'),
    queryForm: require('./directives/queryForm'),
    queryHighlighter: require('./directives/queryHighlighter'),
    queryMenu: require('./directives/queryMenu')
  })
  .name;

