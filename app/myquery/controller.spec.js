describe('MyQueryCtrl', function() {

  beforeEach(module('pmltq.myquery'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('MyQueryCtrl', {$scope: scope});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
