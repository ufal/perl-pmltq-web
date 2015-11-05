module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('treebank.help', {
    url: '/help',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    title: 'Help'
  });

};
