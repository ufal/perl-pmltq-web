/* @ngInject */
function HelpController(treebank, queryParams) {
  /* jshint validthis: true */
  var vm = this;
  vm.treebank = treebank;
  vm.params = queryParams;
}

angular
  .module('pmltq.help')
  .controller('HelpController', HelpController);
