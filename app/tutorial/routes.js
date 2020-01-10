module.exports = function($stateProvider) {
  'ngInject';

  $stateProvider.state('treebank.queryfiletutorial', {
    url: '/tutorials/{userID}?{fileID}',
    template: require('./index.jade'),
    controller: require('./controller'),
    controllerAs: 'vm',
    params: {
      fileID: {squash: false, value: null},
      userID: {squash: false, value: null}
    }
  });

};