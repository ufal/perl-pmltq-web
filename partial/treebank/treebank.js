angular.module('pmltqWeb').controller('TreebankController', function($scope, $stateParams, resultHolder, offCanvas, treebanksApi) {
  $scope.state = 'loading';
  $scope.result = resultHolder();

  treebanksApi.one($stateParams.treebank).get().then(function(treebank) {
    $scope.treebank = treebank;
    $scope.state = 'success';
  }, function(response) {
    $scope.state = 'error';
  });

  var nav;
  $scope.showNavigation = function() {
    if (nav) {
      nav.toggle();
      return;
    }
    nav = offCanvas({
      scope : $scope,
      canvas: '#page-wrapper',
      template: 'partial/navigation/navigation.html',
      show: true
    });
  };

  var helpAside;
  $scope.showHelp = function() {
    if (helpAside) {
      helpAside.toggle();
      return;
    }
    helpAside = offCanvas({
      scope : $scope,
      canvas: '#page-wrapper',
      placement: 'right',
      template: 'pmltqHelp/treebank/helpOffCanvas.html',
      show: true
    });
    // if (!helpAside) {
    //   helpAside = $aside({
    //     scope: $scope,

    //     template: 'pmltqHelp/treebank/treebankHelpAside.html',
    //     container: $('body')
    //   });
    //   return;
    // }
    // helpAside.show();
    // $('body').css('overflow', 'hidden');
  };
});
