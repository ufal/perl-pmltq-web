require('./treebankHelp.less'); // css are shared
var md = require('markdown-it')({
  html: true,
  linkify: true,
  modifyToken: function (token, env) {
    switch (token.type) {
    case 'fence':
      token.tag = 'query-example';
      break;
    case 'link_open':
      token.attrObj.target = '_blank'; // set all links to open in new window
      break;
    };
  }
}).use(require('markdown-it-modify-token'));;

module.exports = function() {
  'ngInject';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      treebank: '='
    },
    link: function(scope, element, attrs) {
            var res = md.render(scope.treebank.documentation);
            console.log(element);
            element.html(res);
        }
  };
};
