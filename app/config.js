module.exports = function configure(module) {
  if (DEVELOPMENT) {
    module.constant('baseUrl', '/');
    module.constant('apiBaseUrl', '/api');
  }

  if (PRODUCTION) {
    module.constant('baseUrl', BASE);
    module.constant('apiBaseUrl', BASEAPI);
  }
};
