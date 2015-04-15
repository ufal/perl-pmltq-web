angular.module('pmltq.treebank').factory('treebanksFilter', function (localStorageService, _) {

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
      filtersParams = {};

  var storageKey = 'treebanks-filter-params';

  function wrapSticker (sticker) {
    return _.extend(sticker, {
      total: 0,
      selected: false,
      disabled: false,
      remaining: 0,
      toggle: function() {
        this.selected = !this.selected;
      },
      select: function() {
        this.selected = true;
      },
      addTotal: function() {
        this.total = this.remaining += 1;
      }
    });
  }

  function extractStickers (treebanksList) {
    return _.chain(treebanksList)
      .map(function(tb) { return tb.getStickers(); })
      .flatten()
      .value();
  }

  // Extract stickers from treebanks
  function categorizeStickers (treebanksList) {
    var categories = {};
    _.forEach(extractStickers(treebanksList), function(sticker) {
      var name = sticker.name,
          category = sticker.category;

      if (!categories[category]) { categories[category] = {}; }
      if (!categories[category][name]) { categories[category][name] = wrapSticker(sticker); }
      categories[category][name].addTotal();
    });

    return categories;
  }

  function updateRemaining (stickersList, treebanksList) {
    _.forEach(stickersList, function(sticker) { sticker.remaining = 0; });
    _.forEach(extractStickers(treebanksList), function(sticker) {
      sticker.remaining += 1;
    });
  }

  function loadFromStorage () {
    filtersParams = localStorageService.get(storageKey) || {};
  }

  function saveToStorage () {
    localStorageService.set(storageKey, filtersParams);
  }

  loadFromStorage();

  function TreebanksFilterFactory (filterName, treebanksList, options) {
    var filter = {
          stickersByCategory: categorizeStickers(treebanksList),
          isEmpty: true
        },
        params = filtersParams[filterName],
        // treebankMap = {},
        newFiltered = [],
        oldFiltered = [];

    options = _.merge(options || {}, defaultOptions);

    filter.stickersList = _.chain(filter.stickersByCategory)
      .values()
      .map(_.values)
      .flatten()
      .value();

    filter.stickerCategories = _.keys(filter.stickersByCategory);

    // _.transform(treebanksList, function(result, tb) { result[tb.id] = tb; }, treebankMap);

    filter.treebanksList = function getFilteredList () {
      var filterByStrickers = _.filter(filter.stickersList, 'selected'),
          hasAnyFilteringStickers = !_.isEmpty(filterByStrickers);

      newFiltered = [];
      for (var i = treebanksList.length - 1; i >= 0; i--) {
        var tb = treebanksList[i];

        // Filter out inaccessible
        if (filter.onlyAccessible && !tb.access) {
          continue;
        }

        if (hasAnyFilteringStickers) {
          var all = true;
          for (var s = filterByStrickers.length - 1; s >= 0; s--) {
            if (!tb.hasSticker(filterByStrickers[s])) {
              all = false;
              break;
            }
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
        oldFiltered = newFiltered;
        updateRemaining(filter.stickersList, newFiltered);
      }

      filter.saveParams();
      filter.isEmpty = oldFiltered.length === 0;

      return oldFiltered;
    };

    filter.saveParams = function saveParams () {
      var toSave = {
        term: filter.term,
        onlyAccessible: filter.onlyAccessible,
        stickers: _.chain(filter.stickersList).filter('selected').pluck('name').value()
      };

      if (!_.isEqual(filtersParams[filterName], toSave)) {
        filtersParams[filterName] = toSave;
        saveToStorage();
      }
    };

    filter.restoreParams = function (params) {
      if (params.term) { filter.term = params.term; }
      if (!_.isUndefined(params.onlyAccessible)) { filter.onlyAccessible = !!params.onlyAccessible; }
      if (params.stickers && !_.isEmpty(params.stickers)) {
        var stickerMap = _.transform(params.stickers, function (result, name) { result[name] = true; }, {});
        for (var i = filter.stickersList.length - 1; i >= 0; i--) {
          var sticker = filter.stickersList[i];
          sticker.selected = !!stickerMap[sticker.name];
        }
      }

      // TODO(remove or improve): Initial load of label
      var list = filter.treebanksList();
      updateRemaining(filter.stickersList, list);
    };

    filter.reset = function () {
      _.merge(filter, options.filterDefaults);
      _.forEach(filter.stickersList, function(sticker) { sticker.selected = false; });
    }

    filter.reset();

    if (params) {
      filter.restoreParams(params);
    }

    return filter;
  }

  return TreebanksFilterFactory;
});
