/* @ngInject */
function HelpController(treebank, queryParams) {
  /* jshint validthis: true */
  var vm = this;
  console.log('TREEBANK HELP: ', treebank);
  vm.treebank = treebank;
  vm.params = queryParams;
}

angular
  .module('pmltq.help')
  .controller('HelpController', HelpController);
