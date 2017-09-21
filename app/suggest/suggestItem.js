var angular = require('angular');
var _ = require('lodash');

module.exports = function SuggestItemFactory() {
  'ngInject';

  var extend = angular.extend;
  /**
   * Encapsulation of suggest item (a query line) properties
   * @param {String} text
   * @param {Number} index
   * @param {SuggestItem[]} list
   * @constructor
   */
  function SuggestItem(text, index, list) {
    if (!(this instanceof SuggestItem)) {
      return new SuggestItem(text, index, list);
    }

    extend(this, /** @lends SuggestItem.prototype */ {
      start: index,
      end: index,
      indent: text.length - _.trimLeft(text).length,
      parsedQuery: list,
      enabledValue: !/^\s*#/.test(text),
      canEnable: !/^\s*][,;]?\s*$/.test(text),
      hidden: false,
      textValue: _.trim(text, ' \t#'),
      /**
       * Return text value
       * @return {String} Actual text
       */
      text: function () {
        var text = this.textValue;
        if (!this.enabledValue) {
          text = '# ' + text;
          if (this.start !== this.end) {
            text += ' ... ]';
          }
        }
        return text;
      },
      /**
       * Toggles enabled/disabled or set it to the value
       * @param {boolean=} value
       */
      enabled: function(value) {
        if (!this.canEnable) {
          return true;
        }

        if (_.isUndefined(value)) {
          return this.enabledValue;
        }

        this.enabledValue = value;
        var index = this.start + 1;
        while (index <= this.end) {
          var item = this.parsedQuery[index];
          if (!item.enabledValue) {
            index = item.end;
          }
          item.hidden = !value;
          index += 1;
        }

        return value;
      },
      remove: function () {
        var start = this.start,
            end = this.end,
            length = end - start + 1,
            list = this.parsedQuery;
        list.splice(start, length);

        // fix start and end
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          if (item.start > start) {
            item.start -= length;
          }
          if (item.end > start) {
            item.end -= length;
          }
        }
      }
    });
  }

  return SuggestItem;
};
