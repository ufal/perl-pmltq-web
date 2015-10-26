/** @type _ */
var _ = require('lodash');

/** @type Rx  */
var Rx = require('rx');

class SvgViewController {
  constructor($scope) {
    'ngInject';

    var lastAddress, lastTree, lastTreebankId;
    if (!$scope.tree) {
      lastTree = $scope.tree = 0;
    }

    this.file = new Rx.Subject();
    this.trees = new Rx.Subject();

    var suggestSubscription;

    $scope.$toObservableGroup(['address', 'tree', 'treebank'])
      .filter((change) => {
        var value = change.newValue,
          address = value[0],
          tree = value[1],
          treebank = value[2];

        if (_.any(change.newValue, (item) => _.isEmpty(item) && !_.isNumber(item)) ||
          (address === lastAddress && tree === lastTree && lastTreebankId === treebank.id)) {
          return false;
        }

        lastAddress = address;
        lastTree = tree;
        lastTreebankId = treebank.id;

        return true;
      })
      .flatMapLatest((change) => {
        var value = change.newValue,
          address = value[0],
          tree = value[1],
          treebank = value[2];

        return Rx.Observable.fromPromise(treebank.loadSvgFile(address, tree));
      }).subscribe((svgFile) => {
        this.file.onNext(svgFile);

        svgFile.tree.subscribe((tree) => {
          var query = $scope.queryParams;
          if (suggestSubscription) {
            suggestSubscription.dispose();
          }

          if (query) {
            suggestSubscription = tree.markedNodes.subscribe((nodes) => {
              query.suggest.onNext(nodes);
            });
          }

          this.trees.onNext(tree);
        });
      });
  }
}

module.exports = function () {
  return {
    restrict: 'A',
    scope: {
      treebank: '=svgView',
      queryParams: '=?',
      tree: '@',
      address: '@'
    },
    controller: SvgViewController
  };
};
