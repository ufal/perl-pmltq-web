var _ = require('lodash');

module.exports = function($scope, recentlyUsed, treebanks) {
  'ngInject';
  var vm = this;

  vm.featured = _.take(treebanks, 5);
  vm.recentlyUsed = _.take(recentlyUsed, 5);
};
