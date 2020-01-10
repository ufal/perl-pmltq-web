describe('TutorialController', function() {

  beforeEach(module('pmltq.tutorial'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('TutorialController', {$scope: scope});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);
  }));
});