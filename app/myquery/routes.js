module.exports = function($stateProvider) {
  'ngInject';

  $stateProvider.state('treebank.myquery', {
    url: '/myqueries',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm'
  });

};
