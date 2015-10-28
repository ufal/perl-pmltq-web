module.exports = function($timeout) {
  'ngInject';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element, $attrs, ngModel) {
      var focuser = () => {
        $element.focus().select();
      };

      if (ngModel) {
        ngModel.$formatters.push((value) => {
          $timeout(focuser);
          return value;
        });
      }

      $element.on('mouseover', focuser);

      focuser();
    }
  };
};
