/* @ngInject */
function SuggestItemFactory(_) {
  var extend = angular.extend;

  /**
   * Encapsulation of suggest item (a query line) properties
   * @param {String} text
   * @param {Number} index
   * @param {SuggestItem[]} list
   * @constructor
   */
  function SuggestItem(text, index, list) {
    var enabled = !/^\s*#/.test(text);

    if (!(this instanceof SuggestItem)) {
      return new SuggestItem(text, index, list);
    }

    extend(this, /** @lends SuggestItem.prototype */ {
      start: index,
      end: index,
      text: _.trim(text, ' \t#'),
      indent: text.length - _.trimLeft(text).length,
      parsedQuery: list,
      /**
       * Toggles enabled/disabled or set it to the value
       * @param {boolean=} value
       */
      enabled: function(value) {
        if (_.isUndefined(value)) {
          return enabled;
        }

        enabled = value;
        for (var i = this.start + 1; i <= this.end; i++) {
          list[i].enabled(value);
        }

        return enabled;
      }
    });
  }

  return SuggestItem;
}

angular
  .module('pmltq.suggest')
  .factory('SuggestItem', SuggestItemFactory);
