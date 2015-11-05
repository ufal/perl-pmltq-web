var _ = require('lodash');

module.exports = function (localStorageService) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  var defaultOptions = {
      sortBy: ['title', 'access'],
      sortOrder: [true, false],
      filterBy: ['title', 'name', 'description'],
      filterDefaults: {
        onlyAccessible: true,
        term: ''
      },
      comperator: function(obj, text) {
        text = ('' + text).toLowerCase();
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      }
    },
    filtersParams = {},
    storageKey = 'treebanks-filter-params';

  function loadFromStorage() {
    filtersParams = localStorageService.get(storageKey) || {};
  }

  function saveToStorage() {
    localStorageService.set(storageKey, filtersParams);
  }

  loadFromStorage();

  function TreebanksFilterFactory(filterName, treebanksList, options) {
    var filter = {isEmpty: true},
      predicates = {
        tags: function (tb) { return _.bind(tb.hasTag, tb); },
        languages: function (tb) { return _.bind(tb.hasLanguage, tb); }
      },
      params = filtersParams[filterName],
      labels = {},
      newFiltered = [],
      oldFiltered = [];

    function labelItem (prefix, item) {
      var key = prefix + '-' + item.id;
      if (labels[key]) {
        return labels[key];
      }

      return labels[key] = {
        id: item.id,
        name: item.name,
        code: item.code || null,
        total: 1,
        selected: false,
        toggle: function() {
          this.selected = !this.selected;
        }
      };
    }

    function updateRemaining(treebanksList) {
      _.forEach(labels, function(item) { item.total = 0; });

      _.forEach(treebanksList, function (tb) {
        _.forEach(tb.tags, function (item) { labelItem('tags', item).total += 1; });
        _.forEach(tb.languages, function (item) { labelItem('languages', item).total += 1; });
      });
    }

    options = _.merge(options || {}, defaultOptions);

    filter.tags = _(treebanksList.tags())
      .map(function (item) { return labelItem('tags', item); })
      .sortBy('name')
      .value();
    filter.languages = _(treebanksList.languages())
      .map(function (item) { return labelItem('languages', item); })
      .sortBy('name')
      .value();
    filter.labels = _.values(labels);
    filter.categories = ['languages', 'tags'];

    filter.treebanksList = function getFilteredList() {
      var filterBy = {
          tags: _.filter(filter.tags, 'selected'),
          languages: _.filter(filter.languages, 'selected')
        },
        hasAnyFilterBy = !_.isEmpty(filterBy.tags) || !_.isEmpty(filterBy.languages);

      newFiltered = [];
      for (var i = treebanksList.length - 1; i >= 0; i--) {
        var tb = treebanksList[i];

        // Filter out inaccessible
        if (filter.onlyAccessible && !tb.isFree) {
          continue;
        }

        if (hasAnyFilterBy) {
          var all = true;
          for (var by in filterBy) {
            var arr = filterBy[by], predicate = predicates[by](tb);
            for (var s = arr.length - 1; s >= 0; s--) {
              if (!predicate(arr[s])) {
                all = false;
                break;
              }
            }
            if (!all) { break; } // Break out of cycle
          }
          if (!all) { continue; }
        }

        if (filter.term) {
          var any = false;
          for (var t = options.filterBy.length - 1; t >= 0; t--) {
            var key = options.filterBy[t];
            if (options.comperator(tb[key], filter.term)) {
              any = true;
              break;
            }
          }
          if (!any) { continue; }
        }

        newFiltered.push(tb);
      }

      // TODO: save filter params and cache filter results
      if (!_.isEqual(newFiltered, oldFiltered)) {
        oldFiltered = _.sortByOrder(newFiltered, options.sortBy, options.sortOrder);
        updateRemaining(newFiltered);
      }

      filter.saveParams();
      filter.isEmpty = oldFiltered.length === 0;

      return oldFiltered;
    };

    filter.saveParams = function saveParams() {
      var toSave = {
        term: filter.term,
        onlyAccessible: filter.onlyAccessible,
        tags: _.chain(filter.tags).filter('selected').pluck('id').value(),
        languages: _.chain(filter.languages).filter('selected').pluck('id').value()
      };

      if (!_.isEqual(filtersParams[filterName], toSave)) {
        filtersParams[filterName] = toSave;
        saveToStorage();
      }
    };

    filter.restoreParams = function restoreParams(params) {
      if (params.term) { filter.term = params.term; }
      if (!_.isUndefined(params.onlyAccessible)) { filter.onlyAccessible = !!params.onlyAccessible; }
      _.forEach(['tags', 'languages'], function (key) {
        var value = params[key];
        if (!_.isEmpty(value)) {
          var map = _.transform(value, function (result, id) { result[id] = true; }, {}),
            arr = filter[key];
          for (var i = arr.length - 1; i >= 0; i--) {
            var item = arr[i];
            item.selected = !!map[item.id];
          }
        }
      });
      // TODO(remove or improve): Initial load of label
      updateRemaining(filter.treebanksList());
    };

    filter.reset = function reset() {
      _.merge(filter, options.filterDefaults);
      _.forEach(filter.labels, function(item) { item.selected = false; });
    };

    filter.reset();

    if (params) {
      filter.restoreParams(params);
    }

    return filter;
  }

  return TreebanksFilterFactory;
};
