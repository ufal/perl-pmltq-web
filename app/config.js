module.exports = function configure(module) {
  if (DEVELOPMENT) {
    module.constant('baseUrl', '/');
//    module.constant('apiBaseUrl', '/api');
    module.constant('apiBaseUrl', 'http://lindat.mff.cuni.cz/services/pmltq/api/');
  }

  if (PRODUCTION) {
    module.constant('baseUrl', BASE);
    module.constant('apiBaseUrl', BASEAPI);
  }
};
