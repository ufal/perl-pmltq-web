describe('Suggest', function() {

  beforeEach(module('pmltq.suggest'));

  var Suggest, query;

  beforeEach(inject(function(_Suggest_) {
    Suggest = _Suggest_;
  }));

  it('should create an instance if not run with new', function () {
    /* jshint -W064 */
    query = 'a-node $a := [\n' +
      '  token = \'foobar\'\n' +
      ']';

    var suggest = Suggest(query);
    expect(suggest instanceof Suggest).toBeTruthy();
  });

  it('should parse query', function () {
    query = 'a-node $a := [\n' +
      '  token = \'foobar\'\n' +
      ']';

    var suggest = new Suggest(query);

    expect(suggest).toBeDefined();
    expect(suggest.originalQuery).toEqual(query);
    expect(suggest.parsedQuery).toEqual(jasmine.any(Array));
    expect(suggest.parsedQuery.length).toEqual(3);
    expect(suggest.query()).toEqual(query);
  });

  it('should remove comments', function () {
    query = 'a-node $a := [\n' +
      '  # some comment\n' +
      '  token = \'foobar\'\n' +
      ']';

    var suggest = new Suggest(query);

    expect(suggest.originalQuery).toEqual(query);
    expect(suggest.parsedQuery).toEqual(jasmine.any(Array));
    expect(suggest.parsedQuery.length).toEqual(4);
    expect(suggest.parsedQuery.filter(function (item) {
      return item.enabled();
    }).length).toEqual(3);
    expect(suggest.query()).toEqual("a-node $a := [\n  token = 'foobar'\n]");
  });

  it('should disable items and still make query', function () {
    query = 'a-node $a := [\n' +
      '  token = \'foobar\'\n' +
      '  token1 = \'foobar\'\n' +
      '  token2 = \'foobar\'\n' +
      ']';

    var suggest = new Suggest(query);

    expect(suggest).toBeDefined();
    expect(suggest.originalQuery).toEqual(query);
    expect(suggest.parsedQuery).toEqual(jasmine.any(Array));
    expect(suggest.parsedQuery.length).toEqual(5);

    suggest.parsedQuery[1].enabled(false);

    expect(suggest.parsedQuery.filter(function (item) {
      return item.enabled();
    }).length).toEqual(4);
    expect(suggest.query()).toEqual('a-node $a := [\n' +
      '  token1 = \'foobar\'\n' +
      '  token2 = \'foobar\'\n' +
      ']');

    suggest.parsedQuery[1].enabled(true);

    expect(suggest.parsedQuery.filter(function (item) {
      return item.enabled();
    }).length).toEqual(5);
    expect(suggest.query()).toEqual(query);
  });

  it('should disable range based on brackets', function () {
    query = 'a-node $a := [\n' +
      '  token = \'foobar\'\n' +
      ']';

    var suggest = new Suggest(query);
    expect(suggest).toBeDefined();
    expect(suggest.originalQuery).toEqual(query);
    expect(suggest.parsedQuery).toEqual(jasmine.any(Array));
    expect(suggest.parsedQuery.filter(function (item) {
      return item.enabled();
    }).length).toEqual(3);

    suggest.parsedQuery[0].enabled(false);
    expect(suggest.parsedQuery.filter(function (item) {
      return item.enabled();
    }).length).toEqual(0);
  });
});
