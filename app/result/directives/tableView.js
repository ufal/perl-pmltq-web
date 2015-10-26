var $ = require('jquery');
var _ = require('lodash');

module.exports = function() {
  function buildTable(dataTable) {
    var table = $('<table></table>').addClass('ui collapsing striped celled table');
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
      result: '=tableView'
    },
    link: function($scope, $element) {
      $scope.$watch('result', function(result) {
        if (!result) {
          return;
        }

        var table = result.resultData;
        $element.empty().append(buildTable(table));
      });
    }
  };
};
