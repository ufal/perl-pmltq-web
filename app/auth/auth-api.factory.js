angular.module('pmltq.auth')
  .factory('authApi', function (Restangular) {

    return Restangular.service('auth').one();
  });
