require('./flatty.css');
require('./index.less');
var humane = require('humane-js');
humane.waitForMove = true;

module.exports = function NotifyFactory() {
  //noinspection BadExpressionStatementJS
  'ngInject';

  return {
    success: function(msg){
         humane.log(msg,{addnCls:"humane-flatty-success"});
      },
    error: function(msg){
         humane.log(msg,{addnCls:"humane-flatty-error"});
      },
    info: function(msg){
         humane.log(msg,{addnCls:"humane-flatty-info"});
      },
  };
};
