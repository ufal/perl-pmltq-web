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
    expect(item2.disabled).toBeTruthy();
    item2.enable();
    expect(item2.disabled).toBeFalsy();
  });

  it('should disable', function () {
    expect(item3.disabled).toBeFalsy();
    item3.disable();
    expect(item3.disabled).toBeTruthy();
  });

  it('should disable range', function () {
    expect(item1.disabled).toBeFalsy();
    expect(item2.disabled).toBeTruthy();
    expect(item3.disabled).toBeFalsy();
    item1.disable();

    expect(item1.disabled).toBeTruthy();
    expect(item2.disabled).toBeTruthy();
    expect(item3.disabled).toBeTruthy();
    item1.enable();

    expect(item1.disabled).toBeFalsy();
    expect(item2.disabled).toBeFalsy();
    expect(item3.disabled).toBeFalsy();
  });

  it('should toggle', function () {
    expect(item2.disabled).toBeTruthy();
    item2.toggle();
    expect(item2.disabled).toBeFalsy();
    item2.toggle();
    expect(item2.disabled).toBeTruthy();
  });

});
