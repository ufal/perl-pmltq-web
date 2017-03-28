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
    queryFileApi.getList().then((files) => {
      vm.files = files;
      vm.files.sort((a, b) => a.name.localeCompare(b.name));
      console.log('history',$scope,vm.files);
      vm.files.forEach(function(qs) {
        var query={};
        qs.queries.forEach( function(q) {query[q.id]=q});
        qs.queries_ = query;
        qs.queryIds=Object.keys(qs.queries_);
      });
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
        return file.saveQuery(query, name);
      });

      m.show();
    }

  vm.deleteQuery = function(file,query) {
    var result = $window.confirm('Do you want to delete this query?');
    if (result) {
      file.deleteQuery(query);
      delete file.queries_[query.id];
      file.queryIds=Object.keys(file.queries_);
      file.totalQueries = file.queryIds.length;
    }
  }

  function saveFileList(name, file) {
    if (file && _.all(vm.files, f => f.name !== name || f.id === file.id)) {
      file.name = name;
      delete file.queries_;
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

  $scope.$on('$destroy', () => {
    if (m) {
      m.destroy();
    }
  });
};
