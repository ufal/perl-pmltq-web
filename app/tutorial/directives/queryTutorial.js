require('./queryTutorial.less');

module.exports = function() {
  'ngInject';

  return {
    restrict: 'AE',
    replace: true,
    scope: {
      treebank: '=',
      query: '='
    },
    template: require('./queryTutorial.jade'),
    link: function ($scope) {
      $scope.queryText = $scope.query.query;
      console.log("$scope=",$scope);
      console.log("query=",$scope.query);
      console.log("treebank=",$scope.treebank);
        // TODO resize minimized readonly editor
    }
  };
};
