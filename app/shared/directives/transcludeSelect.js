var $ = require('jquery');

module.exports = function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs, controller, $transclude) {
      function transcludeSelection(clone) {
        var selector = $attrs.transcludeSelect;
        var selectedElements = getSelectedElements(clone, selector);
        if (selectedElements.length) {
          $element.replaceWith(selectedElements);
        } else {
          $element.remove();
        }
      }

      function getSelectedElements(clone, selector) {
        var wrapper = wrapClone(clone);
        var selectedElements = wrapper.find(selector);
        wrapper.remove();
        return selectedElements;
      }

      function wrapClone(clone) {
        var wrapper = $('<div></div>');
        wrapper.append(clone);
        return wrapper;
      }

      function checkTranscludeOption() {
        if (!$transclude) {
          throw new Error('Illegal use of transcludeSelect directive in the template! ' +
            'No parent directive that requires a transclusion found.');
        }
      }

      checkTranscludeOption();
      $transclude(transcludeSelection);
    }
  };
};
