/** @type _ */
var _ = require('lodash');

module.exports = function PromptModalController($scope, promptOptions, promptOnSave) {
  //noinspection BadExpressionStatementJS
  'ngInject';
  var vm = this;

  vm.saving = false;
  $scope.$on('$stateChangeStart', function () {
    $scope.hide();
  });

  _.extend(vm, promptOptions || {});

  vm.save = function(name) {
    if (vm.saving) {
      return;
    }
    console.log(vm.saving);

    vm.saving = true;
    console.log(vm.saving);
    vm.error = '';
    promptOnSave(name).then(
      ()  => { $scope.hide(); }, // Hide when successfull
      (err) => { vm.error = err; vm.saving = false; }
    );
  };
};
