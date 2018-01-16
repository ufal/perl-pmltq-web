require('./markdownEditor.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    required: '^ngModel',
    scope: {
      treebank: '=',
      ngModel: '=',
      text: '=',
      itemname: '='
    },
    template: require('./markdownEditor.jade'),
    link: function($scope,$element){
      $scope.$on('action', function(){
        $scope.ngModel.description=$scope.text;
        $element.trigger('blur')
      });
    }
  };
};
