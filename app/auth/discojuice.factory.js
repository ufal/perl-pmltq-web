/* @ngInject */
function DiscojuiceFactory($window, $q, $, discojuiceUrl) {

  function Discojuice() {
    var $frame = $('<iframe></iframe>'), deferred = $q.defer();
    $frame
      .appendTo($('body'))
      .css({
        position: 'fixed',
        zIndex: '1099',
        border: '0',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0'
      })
      .attr('src', discojuiceUrl);

    $($window).on('message', function (e) {
      var oe = e.originalEvent;
      if (oe.origin !== $window.location.origin) {
        return;
      }

      deferred.resolve(oe.data);
      $frame.remove();
      $(this).off(e);
    });

    return deferred.promise;
  }

  return Discojuice;
}

angular
  .module('pmltq.auth')
  .constant('discojuiceUrl', 'discojuice.html?service=PML Tree Query&target=/api/v1/auth/shibboleth')
  .factory('Discojuice', DiscojuiceFactory);
