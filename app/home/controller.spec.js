describe('HomeController', function() {

  beforeEach(module('pmltq.home'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HomeController', {$scope: scope, treebanks: [], recentlyUsed: []});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
