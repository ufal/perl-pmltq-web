describe('ResultCtrl', function() {

  beforeEach(module('pmltq.result'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('ResultCtrl', {$scope: scope});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
