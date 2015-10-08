var _ = require('lodash');
var PmltqMode = require('./ace/pmltq/mode');

module.exports = function pmltqModeBuilder($cacheFactory) {
  'ngInject';

  const modeCache = $cacheFactory('mode-cache');
  const defKeywords = 'for|give|distinct|sort|by|desc|asc|filter|where|over|all'.split('|');
  const functions = {
    FUNC: ('descendants|lbrothers|rbrothers|sons|depth_first_order|order_span_min|order_span_max|depth|lower' +
    '|upper|length|substr|tr|replace|substitute|match|ceil|floor|round|trunc|percnt|name|type_of|id|file|tree_no' +
    '|address|abs|exp|power|log|sqrt|ln').split('|'),
    AFUNC: 'min|max|sum|avg|count|ratio|concat|row_number|rank|dense_rank'.split('|')
  };

  function buildMode(treebank) {
    var mode = modeCache.get(treebank.id);

    if (mode) {
      return mode;
    }

    mode = new PmltqMode();
    var keywords = {};
    var completions = {};

    function appendKeywords(type, list) {
      keywords[type] = list.join('|') + (keywords[type] ? '|' + keywords[type] : '');
    }

    function addCompletions(value, type, meta) {
      if (completions[value]) { return; }
      completions[value] = true;
      mode.$completer.addCompletion(value, type, meta || type);
    }

    function addKeywords(type, list, rule) {
      appendKeywords(type, list);
      for (let i = list.length; i--;) {
        mode.$highlightRules.addNewRule('start', [type, 'PAR'], rule(list[i]));
        addCompletions(list[i], type);
      }
    }

    function addAttributes(type, list) {
      appendKeywords(type, list);
      for (let i = list.length; i--;) {
        let attr = list[i];
        mode.$highlightRules.addAttribute(type, attr);
        addCompletions(attr, 'ATTRIBUTE.' + type);
        let parts = attr.split('/');
        if (parts.length > 1) {
          for (let j = 0; j < parts.length; j++) {
            let part = parts[j];
            mode.$highlightRules.addAttribute(type, part);
            addCompletions(part, 'ATTRIBUTE.' + type);
          }
        }
      }
    }

    _.forEach(_.keys(functions), (type) => {
      addKeywords(type, functions[type], (item) => '(\\b' + item + '\\b)(\\()');
    });

    addKeywords('KEYWORD', defKeywords, (item) => '\\b' + item + '\\b');

    _.forEach(_.keys(treebank.nodeTypes), (type) => {
      addKeywords('TYPE.' + type, treebank.nodeTypes[type], (item) => '\\b' + item + '\\b');
    });

    _.forEach(_.keys(treebank.attributes), (type) => {
      addAttributes('TYPE.' + type, treebank.attributes[type]);
    });

    _.forEach(_.keys(treebank.relations), (type) => {
      var relations = treebank.relations[type],
        list = _.isArray(relations) ? relations : _(relations).values().flatten().uniq().value();
      addKeywords('RELATION.' + type, list, (item) => '\\b' + item + '\\b');
    });

    mode.$highlightRules.addDefaultPopRule('step');
    mode.$highlightRules.addKeywords(keywords);
    mode.$tokenizer = null;
    modeCache.put(treebank.id, mode);
    return mode;
  }

  return buildMode;
};
