angular.module('pmltqWeb').factory('treebanks', function(Restangular) {
  return Restangular.service('treebanks');
});
