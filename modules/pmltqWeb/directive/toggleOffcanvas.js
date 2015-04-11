angular.module('pmltqWeb').directive('toggleOffcanvas', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, fn) {

      console.log(element);
      console.log(attrs);
      $(element).click(function (e) {
        var $this   = $(this);
        console.log($this);
        var target  = $this.attr('data-target');
        var $canvas = $(target);
        var data    = $canvas.data('bs.offcanvas');
        var option  = data ? 'toggle' : $this.data();

        console.log(attrs);
        e.preventDefault();
        e.stopPropagation();

        if (data) {
          data.toggle();
        } else {
          $canvas.offcanvas(option);
        }
      });
    }
  };
});
