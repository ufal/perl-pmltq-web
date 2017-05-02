var angular = require('angular');

module.exports = angular.module('pmltq.api', [require('../shared')])
  .factory('tredSvg', require('./tred/svgFile'))
  .factory('treebankCollectionFactory', require('./treebankCollection'))
  .factory('treebankModelFactory', require('./treebankModel'))
  .factory('treebankApi', require('./treebankApi'))
  .factory('queryFileApi', require('./queryFileApi'))
  .factory('publicFileTreeApi', require('./publicFileTreeApi'))
  .factory('historyApi', require('./historyApi'))
  .name;
