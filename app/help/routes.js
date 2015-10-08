module.exports = function($stateProvider) {
  'ngInject';

  $stateProvider.state('treebank.help', {
    url: '/help',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm'
  });

};
