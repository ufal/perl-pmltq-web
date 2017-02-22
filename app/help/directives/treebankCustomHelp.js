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
      var res = md.render($scope.treebank.documentation);
      $element.html($compile(res)($scope));
    }
  };
};
