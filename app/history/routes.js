module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('treebank.history', {
    url: '/history',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm'
  });

};
