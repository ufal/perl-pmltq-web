var _ = require('lodash');

module.exports = function() {
  const RESULT_TYPE_NODES = 'nodes',
    RESULT_TYPE_TABLE = 'table';

  var extend = _.extend,
    forEach = _.forEach;

  function ResultFactory(initial) {
    var resultHolder = initial || {isEmpty: true},
      resultData = null;

    resultHolder.empty = function() {
      forEach([
        'activeNode',
        'currentResult',
        'hasResult',
        'lastError',
        'nodesCount',
        'queryNodes',
        'resultNo',
        'tree',
        'type'
      ], function(value) {
        delete resultHolder[value];
      });
      resultHolder.isEmpty = true;
    };

    resultHolder.submit = function(treebank, queryParams) {
      resultHolder.submited = true;
      resultHolder.queryParams = queryParams;
      queryParams.cache(); // save to cache
      treebank.post('query', queryParams.params())
        .then(resultHolder.set, resultHolder.setErr);
    };

    resultHolder.get = function() {
      return resultData;
    };

    resultHolder.set = function(data) {
      resultData = data.results;
      var nodes = data.nodes,
        firstResult = resultData && resultData.length > 0 ? _.first(resultData) : [];

      resultHolder.empty();
      extend(resultHolder, {
        isEmpty: false,
        resultId: _.uniqueId('result_'),
        submited: false,
        lastError: null
      });

      if (nodes) {
        extend(resultHolder, {
          type: RESULT_TYPE_NODES,
          queryNodes: nodes,
          nodesCount: resultData.length,
          currentResult: firstResult,
          activeNode: 0,
          resultNo: 1,
          tree: 0
        });
      } else {
        extend(resultHolder, {
          type: RESULT_TYPE_TABLE
        });
      }
    };

    resultHolder.setErr = function(err) {
      extend(resultHolder, {
        submited: false,
        lastError: err
      });
    };

    return resultHolder;
  }

  return ResultFactory;
};
