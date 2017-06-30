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
    link: function($scope,$element){
      $scope.$on('action', function(){
        $element.trigger('blur')
      });
    }
  };
};
