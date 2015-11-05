var _ = require('lodash');

module.exports = function($stateProvider) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  $stateProvider.state('treebank.suggest', {
    url: '/suggest?basedOn',
    templateUrl: require('./index.jade'),
    controller: require('./controller'),
    abstract: true,
    params: {
      ids: {array: true}
    },
    resolve: {
      suggest: function(treebank, result, Suggest, $stateParams) {
        var basedOn = $stateParams.basedOn;
        if (!basedOn) { return false; }
        if (!_.isArray(basedOn)) { basedOn = [basedOn]; }
        return treebank.post('suggest', {ids: basedOn}).then(function (data) {
          return new Suggest(data.query);
        });
      }
    }
  });

  $stateProvider.state('treebank.suggest.index', {
    url: ''
  });
};
