var $ = require('jquery');

module.exports = function ShortenerModalController($scope, shortener, url, title) {
  'ngInject';
  var vm = this;

  vm.loading = true;

  $scope.$on('$stateChangeStart', function () {
    $scope.hide();
  });

  shortener(url, title)
    .then((data) => {
      vm.shortenedUrl = data.shortenedUrl;
    })
    .finally(() => {
      vm.loading = false;
    });
};
