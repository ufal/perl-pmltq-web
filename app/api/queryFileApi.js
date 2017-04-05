/** @type Rx  */
var Rx = require('rx');
/** @type _ */
var _ = require('lodash');

module.exports = function (Restangular, $q, $cacheFactory) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    //RestangularConfigurer.setDefaultHttpFields({cache: true});
    var cache = $cacheFactory('http');
    RestangularConfigurer.setDefaultHttpFields({cache: cache});
    RestangularConfigurer.extendModel('user/query-files', function (model) {
      model.toString = function() {
        return this.name;
      };

      model._update = function() {
        cache.removeAll();
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

      model.newQuery = function(name, querytext, first_used_treebank) {
        return this.post('queries', {name: name, query: querytext, first_used_treebank: first_used_treebank})
          .then(query => {
            this.queries.push(query);
            this.currentQueryIndex = this.queries.length - 1;
            this.totalQueries = this.queries.length;
            this._update();

            return query;
          }, (res) => $q.reject(res.data.error));
      };

      model.saveQuery = function(query, name, querytext) {
        var qr = this.one('queries', query.id);
        qr.query = querytext ? querytext : query.query;
        qr.name = name ? name : query.name;
        return qr.put().then(q => {
          query.name = q.name;
          query.query = q.query;
          return q;
        }, (res) => $q.reject(res.data.error));
      };

      model.deleteQuery = function(query) {
        return this.one('queries', query.id).remove()
          .then(aaa => {
            this.queries = this.queries.filter(q => q.id != query.id);
            this.currentQueryIndex = 0;
            this.totalQueries = this.queries.length;
            this._update();

            return null;
          }, (res) => $q.reject(res.data.error));
      };
console.log(model);

      model.currentQueryIndex = 0;
      model.totalQueries = model.queries.length;
      model.currentQuery = new Rx.ReplaySubject(1);
      model._update();

      return model;
    });
  });

  return restangular.service('user/query-files');
};
