module.exports = function($document) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.focus();
      $document.scrollTopAnimated();
    }
  };
};
