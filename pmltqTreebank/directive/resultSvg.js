angular.module('pmltqTreebank').directive('resultSvg', function($cacheFactory) {
  var cache = $cacheFactory('svg-result-cache');

  return {
    restrict: 'A',
    require: '^treebankDetail',
    link: function($scope, $element, $attrs, treebankDetail) {

      var lastResult;
      $scope.$on('result.changed', function (e, result, resultNo) {
        if (resultNo > 0) {
          if (angular.equals(result, lastResult)) {
            return;
          }
          var key = treebankDetail.getTreebank().id + result.join(':');
          var cacheEntry = cache.get(key);

          lastResult = result;
          if (cacheEntry) {
            $element.html(cacheEntry);
          } else {
            treebankDetail.getTreebank().post('svg', {
              nodes: result,
              tree_no: 0
            }).then(function(response) {
              cache.put(key, response);
              $element.html(response);
            });
          }
        } else {
          $element.empty();
        }
      });

    }
  };
});
