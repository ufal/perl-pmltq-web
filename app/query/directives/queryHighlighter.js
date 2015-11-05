var $ = require('jquery');
var ace = require('brace');

require('./queryHighlighter.less');

module.exports = function ($document, pmltqModeBuilder) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  const theme = require('../ace/pmltq/theme');

  var EditSession = ace.acequire('ace/edit_session').EditSession;
  var TextLayer = ace.acequire('ace/layer/text').Text;
  var dom = ace.acequire('ace/lib/dom');

  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: {
      treebank: '=queryHighlighter'
    },
    link: function ($scope, $element, $attrs, ngModel) {
      var mode = pmltqModeBuilder($scope.treebank);
      dom.importCssString(theme.cssText, theme.cssClass);

      var session = new EditSession('');
      session.setUseWorker(false);
      session.setMode(mode);

      var textLayer = new TextLayer($('<div></div>')[0]);
      textLayer.setSession(session);
      textLayer.config = {
        characterWidth: 10,
        lineHeight: 20
      };

      if (ngModel) {
        ngModel.$render = function () {
          session.setValue(ngModel.$viewValue);
          var stringBuilder = [];
          var length =  session.getLength();

          for (var ix = 0; ix < length; ix++) {
            stringBuilder.push('<div class="ace_line">');
            textLayer.$renderLine(stringBuilder, ix, true, false);
            stringBuilder.push('</div>');
          }

          textLayer.destroy();

          var html = '<div class="' + theme.cssClass + ' ace_static_highlight">' +
            stringBuilder.join('') +
            '</div>';
          $($element).html(html);
        };
      }
    }
  };
};
