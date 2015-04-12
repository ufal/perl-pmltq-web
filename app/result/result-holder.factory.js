angular.module('pmltq.result').factory('resultHolder', function(constants, _) {
  var RESULT_TYPE_NODES = constants.RESULT_TYPE_NODES,
      RESULT_TYPE_TABLE = constants.RESULT_TYPE_TABLE;

  var extend = angular.extend,
      forEach = angular.forEach;

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
        'svg',
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
      treebank.post('query', queryParams)
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
          tree: 0,
          svg: {}
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
});
