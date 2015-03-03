angular.module('pmltqWeb').directive('holder', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if(attrs.holder) {
        attrs.$set('data-src', attrs.holder);
      }
      Holder.run({images:element[0]});
    }
  };
});
