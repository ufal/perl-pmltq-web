require('./treebankHelp.less'); // css are shared
var md = require('markdown-it')({
  html: true,
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
    scope: {
      treebank: '='
    },
    link: function($scope, $element, $attr) {
      var documentation;
      if($scope.treebank.documentation) {
        $scope.treebank.one('documentation').get().then(doc => {
          var res = md.render(doc.documentation);
          $element.html($compile(res)($scope));
        })
      }
    }
  };
};
