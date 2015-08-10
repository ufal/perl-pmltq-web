angular.module('pmltq.treebank').factory('sticker', function (_) {

  var defaultOptions = {
    defaultCategory: 'Others'
  };

  return function(options) {

    var stickersSet = {};
    options = _.defaults(options || {}, defaultOptions);

    function StickerFactory(stickerData) {
      var sticker = stickersSet[stickerData.id];

      if (!sticker) {
        sticker = stickersSet[stickerData.id] = {
          cls: stickerData.comment, // TODO: CSS class hidden in sticker comment
          name: stickerData.name,
          category: options.defaultCategory
        };

        if (stickerData.parent) {
          sticker.category = stickerData.parent.name;
        }
      }

      return sticker;
    }

    return StickerFactory;
  };
});
