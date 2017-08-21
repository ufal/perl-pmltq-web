/** @type Rx  */
var Rx = require('rx');
/** @type _ */
var _ = require('lodash');

module.exports = function (Restangular) {
  'ngInject';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHttpFields({cache: false});
    RestangularConfigurer.extendModel('user/history', function (model) {
      model.toString = function() {
        return this.name;
      };

      model._update = function() {
        //cache.removeAll();
        if (this.totalQueries) {
          this.activeQuery = this.queries[this.currentQueryIndex];
        } else {
          this.activeQuery = null;
        }
        this.currentQuery.onNext(this.activeQuery);
        this.hasPrevious = this.currentQueryIndex > 0;
        this.hasNext = this.currentQueryIndex + 1 < this.totalQueries;
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

      model.currentQueryIndex = model.queries.length -1;
      model.totalQueries = model.queries.length;
      model.currentQuery = new Rx.ReplaySubject(1);
      model._update();

      return model;
    });
  });    
  return restangular.service('user/history');
};
