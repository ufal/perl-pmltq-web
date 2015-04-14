describe('QueryController', function() {

  beforeEach(module('pmltq.query'));

  var scope, ctrl;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('QueryController', {$scope: scope, treebank: {}});
    }));

  it('should ...', inject(function() {

    expect(1).toEqual(1);

  }));

});
