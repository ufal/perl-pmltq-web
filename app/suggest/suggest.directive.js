angular.module('pmltq.suggest').directive('querySuggest', function() {

  function parseSuggest(query) {
    var lines = query.split('\n'), stack = [];

    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];

    }
  }

  return {
    restrict: 'A',
    scope: {
      query: '=suggest'
    },
    templateUrl: 'query/query-suggest.directive.html',
    link: function($scope) {
      $scope.$watch('query', function (query) {
        if (!query) {
          return;
        }

        $scope.suggest = parseSuggest(query);
      });
      //$scope.$watchGroup(['ids', 'vars'], function() {
      //  var treebank = $scope.treebank,
      //      ids = $scope.ids,
      //      vars = $scope.vars;
      //
      //  treebank.post('suggest', {
      //    ids: ids,
      //    vars: vars
      //  }).then(function (data) {
      //    $scope.suggest = parseSuggest(data.query);
      //  });
      //});
    }
  };
});
