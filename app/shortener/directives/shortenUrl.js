function port($location) {
  var protocol = $location.protocol(), p = $location.port();

  if ((protocol === 'http' && p === 80) || (protocol === 'https' && p === 443)) {
    return '';
  }

  return ':' + p;
}

module.exports = function ($location, $document, $state, baseUrl, shortenerModal) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var m;
      $element.click(function (e) {
        e.preventDefault();
        var url, title = $scope.$eval($attrs.urlTitle);

        if ($attrs.state) {
          url = $state.href($attrs.state, $scope.$eval($attrs.stateParams) || {});
          url = $location.protocol() + '://' + $location.host() + port($location) + baseUrl + url;
        } else {
          url = $scope.$eval($attrs.url);
          if (!url) {
            url = $location.absUrl();
          }
        }

        if (!title) {
          title = $document.title;
        }

        m = shortenerModal(url, title);
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
