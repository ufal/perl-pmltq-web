(function () {
  function ResultSentenceController ($scope) {
    var vm = this;

    vm.sentence = function() {
      return $scope.sentence;
    };
  }

  angular.module('pmltq.result').controller('ResultSentenceController', ResultSentenceController);
})();
