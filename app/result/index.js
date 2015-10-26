var angular = require('angular');

module.exports = angular.module('pmltq.result', [require('../shared')])
  .config(require('./routes'))
  .directive({
    svgView: require('./directives/svgView'),
    svgPane: require('./directives/svgPane'),
    tableView: require('./directives/tableView'),
    resultSentence: require('./directives/resultSentence'),
    sentenceToken: require('./directives/sentenceToken'),
    fileControls: require('./directives/fileControls'),
    matchedNodes: require('./directives/matchedNodes'),
    resultControls: require('./directives/resultControls')
  })
  .name;
