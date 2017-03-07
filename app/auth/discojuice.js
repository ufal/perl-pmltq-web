var $ = require('jquery');

module.exports = function DiscojuiceFactory($window, $q, discojuiceUrl) {
  //noinspection BadExpressionStatementJS
  'ngInject';

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
      var oe = e.originalEvent,
        l = $window.location,
        origin = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '');

      if (oe.origin !== origin) {
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
};
