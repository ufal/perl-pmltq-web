var app = angular.module('pmltq.query')
  .constant('pmltqAceConfig', {})
  .directive('queryHighlighter', function (pmltqMode) {

    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var opts = angular.extend({}, scope.$eval(attrs.queryHighlighter));
        var EditSession = window.ace.require('ace/edit_session').EditSession;
        var TextLayer = window.ace.require('ace/layer/text').Text;
        var dom = window.ace.require('ace/lib/dom');
        var mode = pmltqMode(scope.treebank);
        var theme = window.ace.require('ace/theme/pmltq');
        dom.importCssString(theme.cssText, theme.cssClass);
        var session = new EditSession('');
        session.setUseWorker(false);
        session.setMode(mode);
        var textLayer = new TextLayer(document.createElement('div'));
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

            var html = '<div class="' + theme.cssClass + '">' +
              '<div class="ace_static_highlight">' +
              stringBuilder.join('') +
              '</div>' +
              '</div>';
            $(elm).html(html);

          };
        }
      }
    };
  });
