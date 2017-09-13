/** @type _ */
var _ = require('lodash');

require('./queryForm.less');

const suggestHelpKey = 'suggest-hide-help';
const lastQueryListKey = 'last-query-list';
const lastQueryIdKey = 'last-query-id';

//module.exports = function (localStorageService, uiModal) {
module.exports = function ($stateParams, $state, $window, observeOnScope, localStorageService, Auth, queryFileApi, historyApi, publicFileApi, promptModal, notify) {
  'ngInject';

  class QueryFormController {
    constructor($scope) {
      //noinspection BadExpressionStatementJS
      'ngInject';
      this.loggedIn = false;
      this.queryLists = [];
      this.queryHistory = [];

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

      $scope.$toObservable('vm.publicQueryList.activeQuery')
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
            var setquery=false;
            if($stateParams.queryID) {
              localStorageService.set(lastQueryIdKey, parseInt($stateParams.queryID));
              setquery=true;
            }
            if($stateParams.fileID) {
              localStorageService.set(lastQueryListKey, parseInt($stateParams.fileID));
              setquery=true;
            }
            this.loadQueryLists(setquery);
            this.loadQueryHistory();
          } else {
            this.queryLists = [];
            this.queryHistory = [];
          }
          if($stateParams.userID && $stateParams.fileID) { // load public query list if set
            publicFileApi.one($stateParams.userID).get({'file': $stateParams.fileID}).then(list => {
              list.queries.sort((a,b) => (a.ord - b.ord));
              this.publicQueryList = list;
              this.activeQueryList = null;
              var lastQueryId = 0;//localStorageService.get(lastQueryIdKey);
              this.publicQueryList.setActiveQuery(this.publicQueryList.queries[0].id);
              this.queryParams.query = this.publicQueryList.activeQuery.query;
            });
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

    loadQueryLists(setquery) {
      queryFileApi.getList({history_list: true}).then(lists => {
        this.queryLists = lists;
        this.queryLists.sort((a, b) => a.name.localeCompare(b.name));
        this.queryLists.forEach(function(list){
          list.queries.sort((a,b) => (a.ord - b.ord));
        });
        var lastQueryListId = localStorageService.get(lastQueryListKey);
        var lastQueryId = localStorageService.get(lastQueryIdKey);
        if (lastQueryListId) {
          this.activeQueryList = _.find(lists, 'id', lastQueryListId);

          if (this.activeQueryList && lastQueryId) {
            this.activeQueryList.setActiveQuery(lastQueryId);
            if(setquery) {
              this.queryParams.query = this.activeQueryList.activeQuery.query;
            }
          }
        }
      });
    }

    loadQueryHistory() {
      historyApi.getList().then(history => {
        this.queryHistory = history[0];
      });
    }

    newQueryList() {
      var m = promptModal({
        title: 'New List',
        placeholder: 'List name',
        required: 'required',
        label: 'Name'
      }, (name) => {      if (_.all(this.files, f => f.name !== name)) { // creates a new list
        return queryFileApi.post({name: name}).then(
          file => { 
            this.queryLists.push(file); 
            this.queryLists.sort((a, b) => a.name.localeCompare(b.name));
            this.activeQueryList = file;
            notify.success('List has been created');
          },
          res  => {
            notify.error('ERROR: '+res.data.error);
            res.data.error
          }
        );
        }

        return $q.reject('List with the same name already exists');
      });

      m.show();
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
        return this.activeQueryList.newQuery( {name: name, query: this.queryParams.query});
      });

      m.show();
    }

    saveQuery() {
      // Sanity check
      if (!this.activeQueryList || !this.activeQueryList.activeQuery) {
        return;
      }

      this.activeQueryList.saveQuery(this.activeQueryList.activeQuery, {query: this.queryParams.query});
    }

    renameQuery() {
      // Sanity check
      if (!this.activeQueryList) {
        return;
      }

      var m = promptModal({
        title: 'Rename Query',
        placeholder: 'Query name',
        required: 'required',
        label: 'Name',
        value: this.activeQueryList.activeQuery.name
      }, (name) => {
        return this.activeQueryList.saveQuery(this.activeQueryList.activeQuery, {name: name});
      });

      m.show();
    }


    editQuery(query) {
console.log('TODO: fix edit query');
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

    deleteQuery(query) {
      if (!this.activeQueryList || !this.activeQueryList.activeQuery) {
        return;
      }
      var result = $window.confirm('Do you want to delete this query?');
      if (result) {
        this.activeQueryList.deleteQuery(this.activeQueryList.activeQuery);
      }
    }

    selectQuery(queryList = this.activeQueryList) {
      // Sanity check
      if (!queryList) {
        return;
      }

      queryList.setActiveQuery(queryList.activeQuery.id);
      this.queryParams.query = queryList.activeQuery.query;
    }

    previousQuery(queryList = this.activeQueryList) {
      // Sanity check
      if (!queryList) {
        return;
      }

      queryList.previous();
      this.queryParams.query = queryList.activeQuery.query;
    }

    nextQuery(queryList = this.activeQueryList) {
      // Sanity check
      if (!queryList) {
        return;
      }

      queryList.next();
      this.queryParams.query = queryList.activeQuery.query;
    }

    undo() {
      // Sanity check
      if (!this.queryHistory) {
        return;
      }

      this.queryHistory.previous();
      this.queryParams.query = this.queryHistory.activeQuery.query;
    }

    repeat() {
      // Sanity check
      if (!this.queryHistory) {
        return;
      }

      this.queryHistory.next();
      this.queryParams.query = this.queryHistory.activeQuery.query;
    }

    validQuery() {
      return (this.queryHistory && this.queryHistory.activeQuery && this.queryHistory.activeQuery.treebanks[this.treebank.id] && this.queryHistory.activeQuery.query == this.queryParams.query)
        || (this.activeQueryList && this.activeQueryList.activeQuery && this.activeQueryList.activeQuery.treebanks[this.treebank.id] && this.activeQueryList.activeQuery.query == this.queryParams.query)
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
      this.queryParams.queryRecordId = null;
      if (this.activeQueryList && this.activeQueryList.activeQuery && this.activeQueryList.activeQuery.query == this.queryParams.query) {
        this.queryParams.queryRecordId = this.activeQueryList.activeQuery.id;
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
      this.queryParams.query += '\n' + this.suggestObj.query();
      this.suggestObj = null;
    }

    replaceQuery() {
      this.queryParams.query = this.suggestObj.query();
      this.suggestObj = null;
    }

    shorten(query) {

    }
  }

  return {
    restrict: 'A',
    scope: {
      treebank: '=queryForm',
      queryParams: '=',
      queryFileParams: '=',
      onSubmit: '&'
    },
    controller: QueryFormController,
    controllerAs: 'vm',
    bindToController: true,
    template: require('./queryForm.jade')
  };
};
