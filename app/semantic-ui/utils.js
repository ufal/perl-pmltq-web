module.exports = function UtilsFactory($templateCache, $http) {
  'ngInject';

  var fetchPromises = {};

  return {
    /**
     * Fetches template and returns a promise
     * @param {String} template
     * @return {IPromise}
     */
    fetchTemplate: function(template) {
      if (fetchPromises[template]) {
        return fetchPromises[template];
      }
      return (fetchPromises[template] = $http.get(template, {cache: $templateCache}).then(function(res) {
        return res.data;
      }));
    },
    /**
     * Safely digest scope
     * @param {IScope} scope
     */
    safeDigest: function(scope) {
      if (!scope.$$phase && !(scope.$root && scope.$root.$$phase)) {
        scope.$digest();
      }
    }
  };
};
