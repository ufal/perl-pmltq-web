var md = require('markdown-it')({
  // html: true,
  linkify: true,
  modifyToken: function (token, env) {
    switch (token.type) {
    case 'fence':
      token.tag = '';
      token.markup = '';
      token.type = 'html_block';
      token.content = '<query-example treebank="treebank"><pre>'+token.content+'</pre></query-example>';
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
}).use(require('markdown-it-modify-token'));;

module.exports = function($compile) {
  'ngInject';
  return {
    restrict: 'EC',
    replace: true,
    require:"ngModel",
    link: function($scope, $element, $attr,ngModel) {
      $scope.$watch(function(){ return ngModel.$modelValue; },
                    function(text){
                      var res = md.render(text || '');
                      $element.html($compile(res)($scope));
                    });
      
      var res = md.render(ngModel.$modelValue || '');
      $element.html($compile(res)($scope));
    }
  };
};
