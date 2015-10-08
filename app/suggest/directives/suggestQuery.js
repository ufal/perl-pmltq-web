
require('./suggestQuery.less');

module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      suggest: '=suggestQuery'
    },
    template: require('./suggestQuery.jade')
  };
};
