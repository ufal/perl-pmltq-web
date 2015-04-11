angular.module('pmltq.help').directive('treebankHelp', function($window, $timeout) {
  function affixFactory (element, options) {
    // var affix = $affix(element, options);
    // options.scope.$on('$destroy', function() {
    //   if (!affix) {
    //     return;
    //   }

    //   affix.destroy();
    //   affix = null;
    // });
    // $timeout(function() {
    //   affix.$onResize();
    // });
    // return affix;
  }

  return {
    restrict: 'A',
    replace: true,
    scope: {
      metadata: '=treebankHelp',
      navigation: '='
    },
    templateUrl: 'pmltq.help/treebank/treebankHelp.html',
    link: function($scope, $element, $attrs) {
      if (angular.isUndefined($scope.navigation)) {
        $scope.navigation = true;
      }

      var affix;
      $scope.$watch('navigation', function(navigation) {
        if (!navigation || affix) {
          return;
        }
        affix = affixFactory(
          angular.element($element.find('.affix-navigation')),
          {scope: $scope, target: angular.element($window), offsetTop: '-50'});
      });
    }
  };
});
