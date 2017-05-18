var md = require('markdown-it')(
    {
      linkify: true
    }
  );

var modif = require('markdown-it-modify-token');

module.exports = function($compile) {
  'ngInject';
  return {
    restrict: 'EC',
    replace: true,
    require:"ngModel",
    scope: {
      title: '=',
      hideUse: '=',
      treebank: '='
    },
    link: function($scope, $element, $attr,ngModel) {
      $scope.$watch(function(){ return ngModel.$modelValue; },
                    function(text){
                      var res = md.render(text || '');
                      $element.html($compile(res)($scope));
                    });
      $scope.title = $scope.title || "Try query";
      $scope.hideUse = !!$scope.hideUse;
      
      md.set({
        // html: true,
        modifyToken: function (token, env) {
          switch (token.type) {
          case 'fence':
            if($scope.treebank){
            token.tag = '';
            token.markup = '';
            token.type = 'html_block';
            token.content = '<query-example treebank="treebank" hide-use="'+$scope.hideUse+'" title="\''+$scope.title+'\'"><pre>'+token.content+'</pre></query-example>';
          }
            break;
          case 'blockquote_open':
            token.tag = '';
            token.markup = '';
            token.type = 'html_block';
            token.content = '<div class="ui info message">';
            break;
          case 'blockquote_close':
            token.tag = '';
            token.markup = '';
            token.type = 'html_block';
            token.content = '</div>';
            break;
          case 'link_open':
            token.attrObj.target = '_blank'; // set all links to open in new window
            break;
          };
        }
      })
      md.use(modif);
      var res = md.render(ngModel.$modelValue || '');
      $element.html($compile(res)($scope));
    }
  };
};
