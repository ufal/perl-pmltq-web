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

      model.newQuery = function(queryData) {
        var newQuery = {
          name: queryData.name,
          query: queryData.query,
          description: queryData.description,
          isPublic: queryData.isPublic
        }
        return this.post('queries', newQuery)
          .then(query => {
            this.queries.push(query);
            this.currentQueryIndex = this.queries.length - 1;
            this.totalQueries = this.queries.length;
            this._update();

            return query;
          }, (res) => $q.reject(res.data.error));
      };

      model.saveQuery = function(query, updateData) {
        var qr = this.one('queries', query.id);
        qr = _.merge(qr,updateData);
        if(qr.treebanks.constructor === Array) {
          qr.treebanks = qr.treebanks.map(function(tb){return {id: tb.id} })
        }
        return qr.put().then(q => {
          query.name = q.name;
          query.query = q.query;
          query.isPublic = q.isPublic;
          query.queryFileId = q.queryFileId; // moving query to other file
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

      model.updateQueryOrder = function() {
        console.log("TODO updateQueryOrder",this);
        var ql = this.all('queries');
        console.log("TODO updateQueryOrder ql=",ql);
        var data = {
          'id': this.id,
          'userId': this.userId,
          'queries': this.queries.map(function(q){return {'id': q.id, 'ord': q.ord}})
        }
        return ql.customPUT(data).then(querylist => {
          return querylist;
        }, (res) => $q.reject(res.data.error));

      };

      model.currentQueryIndex = 0;
      model.totalQueries = model.queries.length;
      model.currentQuery = new Rx.ReplaySubject(1);
      model._update();

      return model;
    });
  });

  return restangular.service('user/query-files');
};
