describe('Suggest', function() {

  beforeEach(module('pmltq.suggest'));

  var SuggestItem, item1, item2, item3, items;

  beforeEach(inject(function(_SuggestItem_) {
    SuggestItem = _SuggestItem_;
  }));

  beforeEach(function () {
    items = [];
    item1 = new SuggestItem('item1', 0, items);
    item1.end = 2;

    item2 = new SuggestItem('#item2', 1, items);
    item3 = new SuggestItem('item3', 2, items);

    items.push(item1, item2, item3);
  });

  it('should enable', function () {
    expect(item2.enabled()).toBeFalsy();
    item2.enabled(true);
    expect(item2.enabled()).toBeTruthy();
  });

  it('should disable', function () {
    expect(item3.enabled()).toBeTruthy();
    item3.enabled(false);
    expect(item3.enabled()).toBeFalsy();
  });

  it('should disable range', function () {
    expect(item1.enabled()).toBeTruthy();
    expect(item2.enabled()).toBeFalsy();
    expect(item3.enabled()).toBeTruthy();
    item1.enabled(false);

    expect(item1.enabled()).toBeFalsy();
    expect(item2.enabled()).toBeFalsy();
    expect(item3.enabled()).toBeFalsy();
    item1.enabled(true);

    expect(item1.enabled()).toBeTruthy();
    expect(item2.enabled()).toBeTruthy();
    expect(item3.enabled()).toBeTruthy();
  });

  it('should toggle', function () {
    expect(item2.enabled()).toBeFalsy();
    item2.enabled(true);
    expect(item2.enabled()).toBeTruthy();
    item2.enabled(false);
    expect(item2.enabled()).toBeFalsy();
  });

});
