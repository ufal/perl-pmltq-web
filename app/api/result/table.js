module.exports = class TableResult {
  constructor(treebank, resultData) {
    this.type = 'table';
    this.treebank = treebank;
    this.resultData = resultData;
  }
};
