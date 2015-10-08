var _ = require('lodash');

module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultControls'
    },
    template: require('./resultControls.jade')
  };
};
