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
    if (!(this instanceof SuggestItem)) {
      return new SuggestItem(text, index, list);
    }

    extend(this, /** @lends SuggestItem.prototype */ {
      start: index,
      end: index,
      indent: text.length - _.trimLeft(text).length,
      parsedQuery: list,
      enabledValue: !/^\s*#/.test(text),
      canEnable: !/^\s*],?\s*$/.test(text),
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
      }
    });
  }

  return SuggestItem;
}

angular
  .module('pmltq.suggest')
  .factory('SuggestItem', SuggestItemFactory);
