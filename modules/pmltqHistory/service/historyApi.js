angular.module('pmltqHistory').factory('historyApi', function (Restangular) {
  return Restangular.service('history');
});
