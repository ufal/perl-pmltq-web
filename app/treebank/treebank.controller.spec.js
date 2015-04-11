describe('TreebankController', function() {

  beforeEach(module('pmltq.treebank'));

  var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('TreebankController', {$scope: scope, treebank: {}, history: {}});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
