module.exports = function configure(module) {
  if (DEVELOPMENT) {
    module.constant('apiBaseUrl', '/api');
    module.constant('discojuiceUrl', 'discojuice.html?service=PML Tree Query&target=/api/auth/shibboleth');
  }

  if (PRODUCTION) {
    module.constant('apiBaseUrl', '/services/pmltq/api');
    module.constant('discojuiceUrl', '/aai/discojuice.html?service=PML Tree Query&target=/services/pmltq/api/auth/shibboleth');
  }
};
