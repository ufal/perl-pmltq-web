var _ = require('lodash');
require('./resultControls.less');

module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      result: '=resultControls'
    },
    template: require('./resultControls.jade')
  };
};
