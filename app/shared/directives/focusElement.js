module.exports = function($document) {
  'ngInject';

  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.focus();
      $document.scrollTopAnimated();
    }
  };
};
