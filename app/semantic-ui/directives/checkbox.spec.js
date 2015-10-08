describe('uiCheckbox', function() {

  beforeEach(module('semanticUI'));

  var scope, compile;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  it('should have right classes', function() {

    var element = compile('<checkbox>test</checkbox>')(scope);

    expect(element.hasClass('ui')).toBeTruthy();
    expect(element.hasClass('checkbox')).toBeTruthy();
    expect(element.attr('class')).toContain('ui checkbox');

    element = compile('<checkbox type="slider">test<checkbox>')(scope);

    expect(element.attr('class')).toContain('ui slider checkbox');

    element = compile('<checkbox type="any">test<checkbox>')(scope);

    expect(element.attr('class')).toContain('ui any checkbox');

    element = compile('<checkbox type="any read-only">test<checkbox>')(scope);

    expect(element.attr('class')).toContain('ui any read-only checkbox');
  });

  it('should transfer attributes', function () {
    var element = compile('<checkbox class="xfoox" foo="bar" foo1="bar1">test</checkbox>')(scope);

    expect(element.attr('class')).toContain('xfoox');
  });

  xit('should propagate to model', function () {
    scope.model = false;
    var element = compile('<checkbox>' +
      '<input id="foo" type="checkbox" ng-model="model" />' +
      '<label for="foo">Some label</label>' +
      '</checkbox>')(scope);
    $(element).click();
    expect(scope.model).toBeTruthy();
  });
});
