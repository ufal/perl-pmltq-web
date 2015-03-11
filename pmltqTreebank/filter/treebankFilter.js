angular.module('pmltqTreebank').filter('treebankFilter', function() {
  return function(list, filter) {
    if (!filter) {
      return list;
    }

    var accessible = !!filter.accessible,
        term = filter.term||'',
        labelsToFilter = _.filter(filter.labels),
        filterLabels = !_.isEmpty(labelsToFilter),
        filtered = [],
        comperator = function(obj, text) {
          text = (''+text).toLowerCase();
          return (''+obj).toLowerCase().indexOf(text) > -1;
        };

    if (!angular.isArray(list)) {
      return list;
    }

    for ( var i = 0, ii = list.length; i < ii; i++) {
      var tb = list[i],
          push = false;
      if (accessible && !tb.access) {
        continue;
      }
      if (filterLabels) {
        var ok = false;
        for (var j = labelsToFilter.length - 1; j >= 0; j--) {
          ok = !!tb.stickers[labelsToFilter[j]];
          if (!ok) {
            continue;
          }
        }
        if (ok) {
          continue;
        }
      }
      if (term) {
        if (comperator(tb.name, term)) {
          push = true;
        }
        if (comperator(tb.title, term)) {
          push = true;
        }
        if (comperator(tb.description, term)) {
          push = true;
        }
      } else {
        push = true;
      }
      if (push) {
        filtered.push(tb);
      }
    }
    filter.count = filtered.length;
    return filtered;
  };
});
