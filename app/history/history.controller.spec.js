describe('HistoryCtrl', function() {

  beforeEach(module('pmltq.history'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HistoryCtrl', {$scope: scope});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
