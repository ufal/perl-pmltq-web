/** @type Rx  */
var Rx = require('rx');
/** @type _ */
var _ = require('lodash');

module.exports = function (Restangular) {
  'ngInject';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHttpFields({cache: true});
  });

  var service = restangular.service('public-query-list')

  service.getPublicList = function (userId, fileId) {
    return Restangular.one("users", userId).one("query-files", fileId).get();
  };
  
  return service;
};
