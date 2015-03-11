angular.module('query').controller('QueryFormCtrl', function($scope, treebanks){

  this.submit = function() {
    if (!$scope.treebank) {
      throw new Error("No treebank is defined on the scope");
    }

    $scope.treebank.post('query', { query : $scope.query.text }).then(function(data) {
      var query = $scope.query;
      query.results = data.results;
      query.nodes = data.nodes;
      query.currentResult = 1;
    }, function (response) {
      console.log(response);
    });
  };
});
