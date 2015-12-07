/** @type _ */
var _ = require('lodash');

require('./queryForm.less');

const suggestHelpKey = 'suggest-hide-help';
const lastQueryListKey = 'last-query-list';
const lastQueryIdKey = 'last-query-id';

module.exports = function ($stateParams, $state, observeOnScope, localStorageService, Auth, queryFileApi, promptModal) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  class QueryFormController {
    constructor($scope) {
      //noinspection BadExpressionStatementJS
      'ngInject';

      this.loggedIn = false;
      this.queryLists = [];

      this.timeoutSelect = [20, 30, 45, 60, 90, 120, 200, 300];
      this.limitSelect = [1, 10, 100, 1000, 10000];
      this.showHelp = !localStorageService.get(suggestHelpKey);

      $scope.$toObservable('vm.activeQueryList')
        .subscribe((list) => {
          list = list.newValue;
          if (_.isUndefined(list)) {
            return;
          }
          localStorageService.set(lastQueryListKey, list === null ? 0 : list.id);
        });
      $scope.$toObservable('vm.activeQueryList.activeQuery')
        .subscribe((query) => {
          query = query.newValue;
          if (_.isUndefined(query)) {
            return;
          }

          localStorageService.set(lastQueryIdKey, query === null ? 0 : query.id);
        });

      Auth.status
        .safeApply($scope, (loggedIn) => {
          this.loggedIn = loggedIn;
          if (loggedIn) {
            this.loadQueryLists();
          } else {
            this.queryLists = [];
          }
        })
        .subscribe();

      this.queryParams.suggest
        .safeApply($scope, (nodes) => {
          this.markedNodes = {
            nodes: nodes,
            any: nodes && nodes.length
          };
        })
        .subscribe();
    }

    loadQueryLists() {
      queryFileApi.getList().then(lists => {
        this.queryLists = lists;
        this.queryLists.sort((a, b) => a.name.localeCompare(b.name));
        var lastQueryListId = localStorageService.get(lastQueryListKey);
        var lastQueryId = localStorageService.get(lastQueryListKey);
        if (lastQueryListId) {
          this.activeQueryList = _.find(lists, 'id', lastQueryListId);

          if (this.activeQueryList && lastQueryId) {
            this.activeQueryList.setActiveQuery(lastQueryId);
          }
        }
      });
    }

    newQuery() {
      // Sanity check
      if (!this.activeQueryList) {
        return;
      }

      var m = promptModal({
        title: 'New Query',
        placeholder: 'Query name',
        required: 'required',
        label: 'Name'
      }, (name) => {
        return this.activeQueryList.newQuery(name);
      });

      m.show();
    }

    editQuery(query) {
      // Sanity check
      if (!this.activeQueryList) {
        return;
      }

      var m = promptModal({
        title: 'Edit Query',
        placeholder: 'Query name',
        required: 'required',
        label: 'Name',
        value: query.name
      }, (name) => {
        return this.activeQueryList.updateQuery(name, query);
      });

      m.show();
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
