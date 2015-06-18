/* @ngInject */
function DiscojuiceFactory($window, $q, $, discojuiceUrl) {

  function Discojuice() {
    if (!discojuiceUrl) {
      throw new Error('discojuiceUrl not defined');
    }

    var $frame = $('<iframe></iframe>'), deferred = $q.defer();
    $frame
      .appendTo($('body'))
      .css({
        position: 'fixed',
        background: 'white',
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

      if (oe.data) {
        deferred.resolve(oe.data);
      } else {
        deferred.reject();
      }
      $frame.remove();
      $(this).off(e);
    });

    return deferred.promise;
  }

  return Discojuice;
}

angular
  .module('pmltq.auth')
  .constant('discojuiceUrl', '')
  .factory('Discojuice', DiscojuiceFactory);
