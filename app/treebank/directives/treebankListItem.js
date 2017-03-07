import randomColor from 'randomcolor';
var _ = require('lodash');

require('./treebankListItem.less');

module.exports = function($state) {
  'ngInject';

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
    var rnd = Math.abs(stringHash(treebank.name)) % colors.length;
    return colors[rnd];
  }

  return {
    restrict: 'A',
    replace: true,
    scope: {
      treebank: '=treebankListItem'
    },
    template: require('./treebankListItem.jade'),
    link: function($scope) {
      var treebank = $scope.treebank;
      $scope.image = {
        text: _.chain(treebank.name)
          .words()
          .thru(function (val) {
            var w = [];
            for (var i = 0; i < val.length; i++) {
              var word = val[i];
              if (word.length === 2) {
                w.push(_.pad(word, 6));
              } else if (word.length === 3) {
                w.push(_.pad(word, 5));
              } else if (word.length > 2) {
                w.push(word);
              }
            }
            return w;
          })
          .value(),
        color: itemColor(treebank)
      };
      $scope.url = $state.href('treebank.index', {treebankId: treebank.name});
    }
  };
};
