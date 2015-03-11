angular.module('pmltqTreebank').factory('treebanksApi', function(Restangular) {
  return Restangular.service('treebanks');
});
