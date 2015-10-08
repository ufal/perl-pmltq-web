var _ = require('lodash');

module.exports = function treebankCollectionFactory() {
  return function treebankCollection (collection) {
    var cache = {
      tags: false,
      tagMap: {},
      languages: false,
      languageMap: {}
    };

    function indexItem(list, map) {
      return function (item) {
        var indexed = map[item.id];
        if (indexed) {
          return indexed;
        }
        list.push(item);
        return map[item.id] = item;
      };
    }

    function extractTagsAndLanguages(treebanks) {
      cache.tags = []; cache.languages = [];
      _.forEach(treebanks, function (tb) {
        tb.tags = _.map(tb.tags, indexItem(cache.tags, cache.tagMap));
        tb.languages = _.map(tb.languages, indexItem(cache.languages, cache.languageMap));
      });
    }

    function collectionGetter(name) {
      return function () {
        var list = cache[name];
        if (list) {
          return list;
        }

        extractTagsAndLanguages(this);
        return cache[name];
      };
    }

    collection.tags = collectionGetter('tags');
    collection.languages = collectionGetter('languages');
    return collection;
  };
};
