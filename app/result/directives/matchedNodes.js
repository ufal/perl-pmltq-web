require('./matchedNodes.less');

module.exports = function () {
  return {
    restrict: 'A',
    scope: {
      result: '=matchedNodes'
    },
    template: require('./matchedNodes.jade'),
    link: function ($scope) {
      $scope.changeNodeTo = function (index) {
        $scope.result.queryNodeNo = index;
        $scope.onNodeChange();
      };
    }
  };
};
