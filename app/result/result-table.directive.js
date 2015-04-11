angular.module('pmltqTreebank').directive('resultTable', function() {
  function buildTable(dataTable) {
    var table = $('<table></table>').addClass('table');
    for (var row = 0; row < dataTable.length; row++) {
      var tr = $('<tr/>');
      table.append(tr);
      for (var col = 0; col < dataTable[row].length; col++) {
        var td = $('<td/>').text(dataTable[row][col]);
        tr.append(td);
      }
    }

    return table;
  }

  return {
    restrict: 'A',
    scope: {
      result: '=resultTable'
    },
    link: function($scope, $element, $attrs) {
      var lastTable;

      $scope.$watch('result.resultId', function(resultId) {
        if (!resultId) {
          return;
        }

        var result = $scope.result,
            table = result.get();
        if (angular.equals(table, lastTable)) {
          return;
        }
        lastTable = table;
        $element.empty().append(buildTable(table));
      });
    }
  };
});
