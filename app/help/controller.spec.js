describe('HelpController', function() {

  beforeEach(module('pmltq.help'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HelpController', {$scope: scope});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);
  }));
});
