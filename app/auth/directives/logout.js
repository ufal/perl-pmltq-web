module.exports = function(Auth, $state) {
  'ngInject';

  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.click(function (e) {
        e.preventDefault();

        Auth.logout().then(function () {
          $state.go('home');
        });
      });
    }
  };
};
