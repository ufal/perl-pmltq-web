angular.module('pmltq.history').factory('historyApi', function (Restangular) {
  return Restangular.service('history');
});
