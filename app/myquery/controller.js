/** @type _ */
var _ = require('lodash');
require('./index.less');

module.exports = function ($scope, $state, $window, $q, promptModal, queryFileApi, treebankApi, Auth, notify) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var vm = this, m;

  vm.user = Auth.user
  vm.files = false;
  vm.loggedIn = false;
  vm.treebanks = {};


  function load() {
    treebankApi.getList().then((treebanks) => {
      treebanks.forEach(function(tb){vm.treebanks[tb.id]=tb})
    });
    queryFileApi.getList({history_list: true}).then((files) => {
      vm.files = files;
      vm.files.sort((a, b) => a.name.localeCompare(b.name));
      vm.files.forEach(function(file){
        file.queries.sort((a,b) => (a.ord - b.ord));
        file.queries.forEach(function(query){
          query.treebanks = Object.keys(query.treebanks)
                                  .filter( tbid => (tbid in vm.treebanks) )
                                  .map(function(tbid){ return vm.treebanks[tbid]})
        })
      })
    });
  }

  vm.renameQuery = function(file,query) {
      var m = promptModal({
        title: 'Rename Query',
        placeholder: 'Query name',
        required: 'required',
        label: 'Name',
        value: query.name
      }, (name) => {
        return file.saveQuery(query, {name: name});
      });

      m.show();
    }

  vm.saveQuery = function(file,query,field) {
      return file.saveQuery(query, {[field]: query[field]});
    }

  vm.shareQuery = function(file, query) {
      return file.saveQuery(query, {isPublic: !query.isPublic});
    }

  vm.deleteQuery = function(file,query) {
    var result = $window.confirm('Do you want to delete this query?');
    if (result) {
      file.deleteQuery(query);
    }
  }

  vm.moveQuery = function(source_file, target_file,query) {
    source_file.saveQuery(query, {queryFileId: target_file.id}).then((qr) => {
      target_file.queries.push(qr);
      source_file.queries.splice(source_file.queries.indexOf(query),1);
    });
  }

  vm.copyQuery = function(source_file, target_file,query) {
    target_file.newQuery(query).then((newQuery) => { });
  }

  vm.saveFile = function(file,field) {
      return saveFileList(file, {[field]: file[field]});
    }

  function saveFileList(file, data) {
    if (file && _.all(vm.files, f => f.name !== data.name || f.id === file.id)) {
      var fl = vm.files.one('', file.id);
      fl = _.merge(fl,data);
      return fl.put().then((f) => {
        file.isPublic = f.isPublic;
        notify.success('List has been saved');
      });
    }
    else if (!file &&   _.all(vm.files, f => f.name !== data.name)) { // creates a new list
      return queryFileApi.post(data).then(
        file => {
          vm.files.push(file);
          notify.success('List has been created');
        },
        res  => res.data.error
      );
    }

    return $q.reject('List with the same name already exists');
  }

  Auth.status
    .safeApply($scope, (loggedIn) => {
      vm.loggedIn = loggedIn;
      if (loggedIn) {
        load();
      } else {
        vm.files = false;
      }
    })
    .subscribe();

  vm.addList = function() {
    m = promptModal({
      title: 'New List',
      placeholder: 'List name',
      required: 'required',
      label: 'Name'
    }, function(name) {
      return saveFileList(undefined,{name: name});
    });

    m.show();
  };

  vm.renameList = function(file) {
    m = promptModal({
      title: 'Rename List',
      placeholder: 'List name',
      required: 'required',
      label: 'Name',
      value: file.name
    }, function(name) {
      return saveFileList(file, {name: name});
    });

    m.show();
  };

  vm.deleteList = function(file) {
    var result = $window.confirm('Do you want to delete this list?');
    if (result) {
      file.remove().then(() => {
        _.remove(vm.files, f => f.id === file.id);
        notify.success('List has removed');
      });
    }
  };

  vm.shareList = function(file) {
    return saveFileList(file, {isPublic: !file.isPublic})
  };

  vm.updateQueryOrder = function(file) {
    for (var index in file.queries) {
          file.queries[index].ord = index;
        }
    return file.updateQueryOrder();
  }

  vm.getTreebanks = function(query) {
    return Object.keys(query.treebanks).map(function (key) {return query.treebanks[key];})
  }

  vm.getQueryTreebankUrl = function(file, query, treebank) {
    return $state.href('treebank.queryfile.index', {treebankId: treebank.name, fileID: file.id, queryID: query.id})
  }

  vm.logo = function(text) {
    return {'logotext': text};
  }

  $scope.$on('$destroy', () => {
    if (m) {
      m.destroy();
    }
  });

  $scope.sortableOptions = {
    connectWith: ".queryfile",
    start: function(e, ui) {
      $scope.$apply(function(){
        $scope.lastSourceFile = ui.item.parent().scope();
        $scope.currentQuery = ui.item.scope().query;
      });
    },
    stop: function(e, ui) {
      if(! ui.item.sortable.droptarget) {
        return;
      }
      var target_file = ui.item.sortable.droptarget.scope();
      var source_file = $scope.lastSourceFile;
      if(source_file !== target_file ) {
        source_file.file.saveQuery($scope.currentQuery, {queryFileId: target_file.file.id})
      }
      vm.updateQueryOrder(target_file.file);
    },
    handle: '.handle',
    cursor: 'move'
  };
};
