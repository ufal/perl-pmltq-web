/** @type Rx  */
var Rx = require('rx');
/** @type _ */
var _ = require('lodash');

module.exports = function (Restangular) {
  'ngInject';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHttpFields({cache: true});
  });



// TODO
  
  return restangular.service('public-query');
};
