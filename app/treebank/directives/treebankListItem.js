var _ = require('lodash');

require('./treebankListItem.less');

module.exports = function($state) {
  'ngInject';

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    template: require('./treebankListItem.jade'),
    link: function($scope) {
      var treebank = $scope.treebank;
      $scope.image = {
        logotext: treebank.name
      };
      $scope.url = $state.href('treebank.index', {treebankId: treebank.name});
    }
  };
};
