var angular = require('angular');

module.exports = angular.module('pmltq.myquery', [require('../shared'), require('../auth'), require('../api'), require('../query')])
  .config(require('./routes'))
  .directive({
     markdownEditor: require('./directives/markdownEditor')
  })
  .name;
