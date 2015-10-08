require('./languageIcon.less');

module.exports = function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      code: '=languageIcon'
    },
    template: `<i class="lang" ng-class="code"></i>`
  };
};
