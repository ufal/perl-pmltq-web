/** @type Rx  */
var Rx = require('rx');

/** @type _ */
var _ = require('lodash');

class SvgResult {
  constructor(treebank, nodes, resultData) {
    this.type = 'svg';
    this.treebank = treebank;

    this.queryNodes = nodes;
    this.total = resultData.length;
    this.resultData = resultData;

    this.activeNodeRx = new Rx.BehaviorSubject(0);
    this.currentRx = new Rx.BehaviorSubject(0);

    this._currentResult = this.currentRx
      .filter((index) => !!this.resultData[index])
      .do((index) => { this._resultNo = index + 1 })
      .map((index) => this.resultData[index]);

    this._nodeAddress = Rx.Observable.combineLatest(this._currentResult, this.activeNodeRx)
      .filter((prop) => _.has(prop[0], prop[1]))
      .do((prop) => { this._activeNode = prop[1]; })
      .map((prop) => prop[0][prop[1]])
      .shareReplay(1);

    this._activeNode = 0;
    this._resultNo = 1;
  }

  get activeNode() {
    return this._activeNode;
  }

  set activeNode(node) {
    if (node >= 0 && node < this.queryNodes.length) {
      this.activeNodeRx.onNext(node);
    }
  }

  get resultNo() {
    return this._resultNo;
  }

  set resultNo(resultNo) {
    if (resultNo >= 1 && resultNo <= this.total) {
      this.currentRx.onNext(resultNo - 1);
    }
  }

  get currentResult() {
    return this._currentResult;
  }

  get nodeAddress() {
    return this._nodeAddress;
  }

  get hasNext() {
    return this.resultNo < this.total;
  }

  next() {
    this.resultNo = this.resultNo + 1
  }

  get hasPrev() {
    return this.resultNo > 1;
  }

  prev() {
    this.resultNo = this.resultNo - 1;
  }
}

module.exports = SvgResult;
