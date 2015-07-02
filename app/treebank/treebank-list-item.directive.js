angular.module('pmltq.treebank').directive('treebankListItem', function($state, randomColor, _) {

  function stringHash(str) {
    var hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  var colors = randomColor({seed: stringHash('pmltq'), count: 200, luminosity: 'dark'});

  function itemColor(treebank) {
    var rnd = Math.abs(stringHash(treebank.id)) % colors.length;
    return colors[rnd];
  }

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    templateUrl: 'treebank/treebank-list-item.directive.html',
    link: function($scope) {

      $scope.$watch('treebank', function(treebank) {

        if (treebank) {
          $scope.image = {
            text: _.chain(treebank.name)
              .words()
              .thru(function (val) {
                var w = [];
                for (var i = 0; i < val.length; i++) {
                  var word = val[i];
                  if (word.length > 1) {
                    w.push(word);
                  }
                }
                return w;
              })
              .value(),
            color: itemColor(treebank),
            background: '#d3d3d3'
          };
          $scope.url = $state.href('treebank.index', {treebankId: treebank.name});
        } else {
          $scope.url = '';
        }
      });
    }
  };
});
