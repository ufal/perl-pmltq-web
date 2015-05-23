angular.module('pmltq.suggest').config(function($stateProvider) {

  $stateProvider.state('treebank.suggest', {
    url: '/suggest?basedOn',
    templateUrl: 'suggest/suggest.html',
    controller: 'SuggestController',
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
});
