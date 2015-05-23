/* @ngInject */
function SuggestModalFactory(_, Suggest, uiModal, $rootScope) {

  function SuggestModal(treebank, onSuggested) {
    var modal = this,
      scope = $rootScope.$new(),
      config = {
        template: 'suggest/suggest-modal.html',
        scope: scope
      };

    modal.treebank = treebank;
    if (!onSuggested) {
      onSuggested = angular.noop();
    }

    scope.append = function insertQuery() {
      if (scope.suggest) {
        onSuggested(scope.suggest, false);
      }
    };

    scope.replace = function replaceQuery() {
      if (scope.suggest) {
        onSuggested(scope.suggest, true);
      }
    };

    uiModal.call(modal, config);
  }

  SuggestModal.prototype = _.create(uiModal.prototype, {
    constructor: SuggestModal,
    suggest: function (ids, vars) {
      var modal = this,
        scope = modal.scope;

      if (scope.loading) {
        return;
      }

      scope.loading = true;
      return modal.treebank.post('suggest', {
        ids: ids,
        vars: vars
      }).then(function (data) {
        scope.suggest = new Suggest(data.query);
      }).finally(function () {
        scope.loading = false;
      });
    }
  });

  return SuggestModal;
}

angular
  .module('pmltq.suggest')
  .factory('SuggestModal', SuggestModalFactory);
