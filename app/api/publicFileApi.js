/** @type Rx  */
var Rx = require('rx');
/** @type _ */
var _ = require('lodash');

module.exports = function (Restangular) {
  'ngInject';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHttpFields({cache: true});



    RestangularConfigurer.extendModel('public-query-list', function (model) {
      model.toString = function() {
        return this.name;
      };

      model._update = function() {
        //cache.removeAll();
        if (this.queries.length) {
          this.activeQuery = this.queries[this.currentQueryIndex];
        } else {
          this.activeQuery = null;
        }
        this.currentQuery.onNext(this.activeQuery);
        this.hasPrevious = this.currentQueryIndex > 0;
        this.hasNext = this.currentQueryIndex + 1 < this.queries.length;
      };

      model.setActiveQuery = function(queryId) {
        var index = _.findIndex(this.queries, 'id', queryId);
        if (index >= 0) {
          this.currentQueryIndex = index;
          this._update();
        }
      };

      model.previous = function() {
        this.currentQueryIndex -= 1;
        this._update();
      };

      model.next = function() {
        this.currentQueryIndex += 1;
        this._update();
      };

      model.currentQueryIndex = -1;
      model.currentQuery = new Rx.ReplaySubject(1);
     // model._update();

      return model;
    });
  });

  var service = restangular.service('public-query-list');


  return service;
};
