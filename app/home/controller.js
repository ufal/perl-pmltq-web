var _ = require('lodash');

module.exports = function($scope, Auth, recentlyUsed, treebanks) {
  'ngInject';
  var vm = this;

  vm.featured = _.take(treebanks, 5);
  vm.recentlyUsed = _.take(recentlyUsed, 5);
  vm.auth = Auth;
};
