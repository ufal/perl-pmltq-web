
class ErrorResult {
  constructor(treebank, message) {
    this.type = 'error';
    this.treebank = treebank;
    this.message = message;
  }
}

module.exports = ErrorResult;
