angular.module('pmltqTreebank').directive('resultTable', function() {
  return {
    restrict: 'A',
    require: '^treebankDetail',
    link: function($scope, $element, $attrs) {
      $scope.$on('result.table', function(result, resultNo, results, ctrl) {
        var table = $('<table></table>');
        for (var row = 0; row < results.length; row++) {
          var tr = $('<tr/>');
          table.append(tr);
          for (var col = 0; col < results[row].length; col++) {
            var td = $('<td/>').text(results[row][col]);
            tr.append(td);
          }
        }
        $element.empty().append(table);
      });

    }
  };
});
