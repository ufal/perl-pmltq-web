require('./treebankHelp.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankHelp'
    },
    template: require('./treebankHelp.jade')
  };
};
