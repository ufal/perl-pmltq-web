require('./markdownEditor.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'AE',
    replace: true,
    scope: {
      treebank: '=',
      text: '=',
      title: '='
    },
    template: require('./markdownEditor.jade'),
  };
};
