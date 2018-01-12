var $ = require('jquery');
require('./discojuice.less');

module.exports = function TestDiscojuiceFactory($window, $q, discojuiceUrl) {
  'ngInject';
  function TestDiscojuice() {
    var l = $window.location,
      ORIGIN = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '');
      var deferred = $q.defer();
      var hash = l.hash,
        service = 'PML Tree Query',
        target = '/services/pmltq/api/auth/shibboleth?loc=' + ORIGIN + l.pathname;

      document.title = service + ' Authentication';
      console.log("target", target);
      var opts = {
        target: target,
        responseUrl: ORIGIN + "/xmlui/themes/UFAL/lib/html/disco-juice.html?",
        metadataFeed: ORIGIN + "/xmlui/discojuice/feeds",
        serviceName: service,
        selector: '#discojuice',
        autoInitialize: false
      };

      if (!window.aai) {
        throw 'Failed to find AAI.';
      }

      var djc = aai.setup(opts);

      djc.always = true;

      DiscoJuice.Utils.options.set(djc);
      
      DiscoJuice.Control.ui = DiscoJuice.UI;
      DiscoJuice.UI.control = DiscoJuice.Control;
      DiscoJuice.UI.enable(this);
      return deferred.promise;
    }

  return TestDiscojuice;
};
