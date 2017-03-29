module.exports = function($stateProvider) {
  'ngInject';

  $stateProvider.state('treebank.history', {
    url: '/bookmarks',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm'
  });

};
