require('./markdownEditor.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      treebank: '=',
      text: '=',
      itemname: '='
    },
    template: require('./markdownEditor.jade'),
  };
};
