var ace = require('brace');
var theme = {
  isDark: false,
  cssClass: 'ace-pmltq',
  cssText: require('./theme.css')
};

var dom = ace.acequire('ace/lib/dom');
dom.importCssString(theme.cssText, theme.cssClass);

module.exports = theme;
