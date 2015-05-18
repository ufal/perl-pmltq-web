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

    /**
     * @this {SuggestItem}
     * @param {boolean} value
     */
    function setDisabled(value) {
      for (var i = this.start; i <= this.end; i++) {
        list[i].disabled = value;
      }
    }

    extend(this, /** @lends SuggestItem.prototype */ {
      start: index,
      end: index,
      text: _.trim(text, ' \t#'),
      parsedQuery: list,
      disabled: /^\s*#/.test(text),
      indent: text.length - _.trimLeft(text).length,
      enable: _.bind(setDisabled, this, false),
      disable: _.bind(setDisabled, this, true),
      toggle: function () {
        if (this.disabled) { this.enable(); }
        else { this.disable(); }
      }
    });
  }

  return SuggestItem;
}

angular
  .module('pmltq.suggest')
  .factory('SuggestItem', SuggestItemFactory);
