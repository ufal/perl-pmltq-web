/** @type _ */
var _ = require('lodash');

require('./queryForm.less');

const suggestHelpKey = 'suggest-hide-help';

module.exports = function (localStorageService) {
  'ngInject';

  class QueryFormController {
    constructor($scope) {
      'ngInject'
      this.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      this.limitSelect = [1, 10, 100, 1000, 10000];
      this.showHelp = !localStorageService.get(suggestHelpKey);

      this.queryParams.suggest
        .safeApply($scope, (nodes) => {
          this.markedNodes = {
            nodes: nodes,
            any: nodes && nodes.length
          };
        })
        .subscribe();
    }

    hideHelp() {
      localStorageService.set(suggestHelpKey, true);
      this.showHelp = false;
    }

    insertToEditor(text) {
      if (this.queryEditor) {
        this.queryEditor.focus();
        this.queryEditor.insert(text);
      }
    }

    submit(filter) {
      if (!this.treebank) {
        return;
      }

      this.queryParams.filter = !_.isUndefined(filter) ? filter : true;
      this.onSubmit();
    }

    suggest(basedOn) {
      if (!this.treebank || !basedOn) {
        return;
      }
      this.treebank.suggest(basedOn).then((suggestObj) => {
        this.suggestObj = suggestObj;
      });
    }

    appendQuery() {
      this.queryParams.text += '\n' + this.suggestObj.query();
      this.suggestObj = null;
    }

    replaceQuery() {
      this.queryParams.text = this.suggestObj.query();
      this.suggestObj = null;
    }
  }

  return {
    restrict: 'A',
    scope: {
      treebank: '=queryForm',
      queryParams: '=',
      onSubmit: '&'
    },
    controller: QueryFormController,
    controllerAs: 'vm',
    bindToController: true,
    template: require('./queryForm.jade')
  };
};
