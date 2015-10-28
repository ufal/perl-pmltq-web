module.exports = function(loginModal) {
  'ngInject';

  return {
    restrict: 'A',
    link: function($scope, $element) {
      var m;
      $element.click(function (e) {
        e.preventDefault();

        m = loginModal();
        m.show();
      });

      $scope.$on('$destroy', function () {
        if (m) {
          m.destroy();
        }
      });
    }
  };
};
