angular.module('pmltqWeb').controller('BrowseTreebanksCtrl', function($scope, treebanks){
  var ctrl = this;
  ctrl.state = 'loading';

  treebanks.getList().then(function(data) {
    if (data && data.length > 0) {
      var labels = {};
      $scope.treebanks = $.each(data, function(index, tb) {
        if (tb.stickers && tb.stickers.length > 0) {
          var stickers = tb.stickers;
          //tb.stickers = {};
          for (var i = 0, ii = stickers.length; i < ii; i += 1) {
            var sticker = stickers[i],
                hasParent = !!sticker.parent,
                key = hasParent ? sticker.parent.name : sticker.name;

            //tb.stickers[sticker.name] = true;

            if (hasParent) {
              if (!labels[key]) { labels[key] = {}; }
              if (!labels[key][sticker.name]) { labels[key][sticker.name] = 0; }
              labels[key][sticker.name] += 1;
            } else {
              if (!labels[key]) { labels[key] = 0; }
              labels[key] += 1;
            }
          }
        }
      }).sort(function (a, b) {
        var res = (a.anonymous && b.anonymous) || (!a.anonymous && !b.anonymous) ? 0 : (a.anonymous ? -1 : 1);
        if (res === 0) {
          return a.title.localeCompare(b.title);
        }
        return res;
      });

      $scope.labels = {};
      for (var lbl1 in labels) {
        if (labels.hasOwnProperty(lbl1) && angular.isObject(labels[lbl1])) {
          $scope.labels[lbl1] = labels[lbl1];
        }
      }

      $scope.freeLabels = {};
      for (var lbl2 in labels) {
        if (labels.hasOwnProperty(lbl2) && !angular.isObject(labels[lbl2])) {
          $scope.freeLabels[lbl2] = labels[lbl2];
        }
      }

      ctrl.state = 'results';
    } else {
      ctrl.state = 'empty';
    }
  });
});
