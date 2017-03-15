var _ = require('lodash');

module.exports = function (Restangular, $q) {
  'ngInject';
  var restangular = Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('https://lindat.mff.cuni.cz/services/shortener/api/v1/');
  });

  var service = restangular.service('handles');

  function shortenUrl(url, title) {
    return service.post({
      url: url,
      title: title,
      reportemail: 'lindat-help@ufal.mff.cuni.cz',
      subprefix: 'PMLTQ'
    }).then((data) => {
      data.shortenedUrl = data.handle;
      return data;
    });
  }

  return shortenUrl;
};
