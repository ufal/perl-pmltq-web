require('./queryTutorial.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'AE',
    replace: true,
    scope: {
      treebank: '=',
      query: '=',
      file: '='
    },
    template: require('./queryTutorial.jade'),
    link: function ($scope) {
      $scope.urlparam = {userID: $scope.file.userId, fileID: $scope.file.id, queryID: $scope.query.id};
    }
  };
};
