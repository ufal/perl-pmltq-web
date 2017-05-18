/** @type _ */
var _ = require('lodash');
require('./index.less');

module.exports = function ($scope, $window, $q, promptModal, queryFileApi, Auth) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var vm = this, m;

  vm.files = false;
  vm.loggedIn = false;

  function load() {
    queryFileApi.getList({history_list: true}).then((files) => {
      vm.files = files;
      vm.files.sort((a, b) => a.name.localeCompare(b.name));
      vm.files.forEach(function(file){file.queries.sort((a,b) => (a.ord - b.ord))})
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

  vm.saveQuery = function(file,query) {
      return file.saveQuery(query, query);
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

  function saveFileList(name, file) {
    if (file && _.all(vm.files, f => f.name !== name || f.id === file.id)) {
      file.name = name;
      return file.put();
    }
    else if (!file && _.all(vm.files, f => f.name !== name)) {
      return queryFileApi.post({name: name}).then(
        file => { vm.files.push(file); },
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
      return saveFileList(name);
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
      return saveFileList(name, file);
    });

    m.show();
  };

  vm.deleteList = function(file) {
    var result = $window.confirm('Do you want to delete this list?');
    if (result) {
      file.remove().then(() => { _.remove(vm.files, f => f.id === file.id); });
    }
  };

  vm.shareList = function(file) {
    if (file) {
      file.isPublic = !file.isPublic;
      return file.put();
    }
  };

  vm.updateQueryOrder = function(file) {
    for (var index in file.queries) {
          console.log('QUERY ',index,file.queries[index]);
          file.queries[index].ord = index;
        }
    return file.updateQueryOrder();
  }

  vm.getTreebanks = function(query) {
    return Object.keys(query.treebanks).map(function (key) {return query.treebanks[key];})
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
      });
    },
    stop: function(e, ui) {
      if(! ui.item.sortable.droptarget) {
        return;
      }
      var target_file = ui.item.sortable.droptarget.scope();
      vm.updateQueryOrder(target_file.file);
      var source_file = $scope.lastSourceFile;
    },
    handle: '.handle',
    cursor: 'move'
  };
};
