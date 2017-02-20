require('./treebankHelp.less'); // css are shared

module.exports = function() {
  'ngInject';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '='
    },
    template: require('./treebankCustomHelp.jade')
  };
};
