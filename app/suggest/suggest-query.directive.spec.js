describe('suggestQuery', function() {

  beforeEach(module('pmltq.suggest'));

  var scope, compile, query;

  beforeEach(inject(function($rootScope, $compile, Suggest) {
    scope = $rootScope.$new();
    query = 'a-node $a := [\n' +
      '  token = \'foobar\'\n' +
      ']';
    scope.suggest = new Suggest(query);
    compile = $compile;
  }));

  it('should display query', function() {

    var element = compile('<div suggest-query="suggest"></div>')(scope);
    scope.$digest();

    expect(element.find('tr:nth-child(1)>td:nth-child(2)').text()).toEqual('a-node $a := [');
    expect(element.find('tr:nth-child(2)>td:nth-child(2)').text()).toEqual("token = 'foobar'");
    expect(element.find('tr:nth-child(3)>td:nth-child(2)').text()).toEqual(']');
  });

  it('should disable parts of query', function () {
    var element = compile('<div suggest-query="suggest"></div>')(scope);
    scope.$digest();

    element.find('tr:nth-child(2)>td:nth-child(1) input').click();
    expect(element.find('tr:nth-child(2)>td:nth-child(2)').text()).toEqual("# token = 'foobar'");

    element.find('tr:nth-child(2)>td:nth-child(1) input').click();
    expect(element.find('tr:nth-child(2)>td:nth-child(2)').text()).toEqual("token = 'foobar'");

    element.find('tr:nth-child(1)>td:nth-child(1) input').click();
    expect(element.find('tr:nth-child(1)>td:nth-child(2)').text()).toEqual('# a-node $a := [');
    expect(element.find('tr:nth-child(2)>td:nth-child(2)').text()).toEqual("# token = 'foobar'");
    expect(element.find('tr:nth-child(3)>td:nth-child(2)').text()).toEqual('# ]');
  });

  it('should apply disabled class on disabled items', function () {
    var element = compile('<div suggest-query="suggest"></div>')(scope);
    scope.$digest();

    expect(element.find('tr:nth-child(2)>td:nth-child(2)').text()).toEqual("token = 'foobar'");
    element.find('tr:nth-child(2)>td:nth-child(1) input').click();

    expect(element.find('tr:nth-child(2)>td:nth-child(2)').hasClass('disabled')).toBeTruthy();

  });
});
