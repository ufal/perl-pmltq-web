var angular = require('angular');

module.exports = angular.module('pmltq.api', [require('../shared')])
  .factory('tredSvg', require('./tred/svgFile'))
  .factory('treebankCollectionFactory', require('./treebankCollection'))
  .factory('treebankModelFactory', require('./treebankModel'))
  .factory('treebankApi', require('./treebankApi'))
  .factory('historyApi', require('./historyApi'))
  .factory('queryFileApi', require('./queryFileApi'))
  .name;
