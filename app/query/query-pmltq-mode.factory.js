angular.module('pmltq.query').factory('pmltqMode', function ($cacheFactory) {
  var modeCache = $cacheFactory('mode-cache');

  function buildPmltqMode (treebank) {
      var PMLTQMode = modeCache.get(treebank.id);
      if (PMLTQMode) {
        return PMLTQMode;
      }

      var m = window.ace.require('ace/mode/pmltq');
      var defKeywords = 'for|give|distinct|sort|by|desc|asc|filter|where|over|all'.split('|');
      var functions = {
        FUNC: ('descendants|lbrothers|rbrothers|sons|depth_first_order|order_span_min|order_span_max|depth|lower' +
        '|upper|length|substr|tr|replace|substitute|match|ceil|floor|round|trunc|percnt|name|type_of|id|file|tree_no' +
        '|address|abs|exp|power|log|sqrt|ln').split('|'),
        AFUNC: 'min|max|sum|avg|count|ratio|concat|row_number|rank|dense_rank'.split('|')
      };
      PMLTQMode = new m.Mode();
      var hl = window.ace.require('ace/mode/pmltq_highlight_rules');
      var com = window.ace.require('ace/mode/pmltq_completions');
      PMLTQMode.$highlightRules = new hl.PmltqHighlightRules();
      PMLTQMode.$completer = new com.PmltqCompletions();
      var keywords = {};
      var completions = {};
      Object.keys(functions).forEach(function (type) {
        var a = functions[type];
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addNewRule('start', [type, 'PAR'], '(\\b' + a[i] + '\\b)(\\()');
          completions[a[i] + '#' + type] = [a[i], type, type];
        }
      });

      var type = 'KEYWORD';
      keywords[type] = defKeywords.join('|') + (keywords[type] ? '|' + keywords[type] : '');
      for (var i = defKeywords.length; i--;) {
        PMLTQMode.$highlightRules.addNewRule('start', type, '\\b' + defKeywords[i] + '\\b');
        completions[defKeywords[i] + '#' + type] = [defKeywords[i], type, type];

      }

      Object.keys(treebank.nodeTypes).forEach(function (type) {
        var a = treebank.nodeTypes[type];
        type = 'TYPE.' + type;
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addNewRule('start', type, '\\b' + a[i] + '\\b');
          completions[a[i] + '#' + type] = [a[i], type, type];
        }
      });
      Object.keys(treebank.attributes).forEach(function (type) {
        var a = treebank.attributes[type];
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addAtributes(type, a[i]);
          completions[a[i] + '#' + 'ATTRIBUTE.' + type] = [a[i], 'ATTRIBUTE.' + type, 'ATTRIBUTE.' + type];
          var b = a[i].split('/');
          if (b.length > 1) {
            for (var j = b.length; j--;) {
              PMLTQMode.$highlightRules.addAtributes(type, b[j]);
              completions[b[j] + '#' + 'ATTRIBUTE.' + type] = [b[j], 'ATTRIBUTE.' + type, 'ATTRIBUTE.' + type];
            }
          }
        }
      });
      var relations = [[treebank.relations, 'RELATION']];
      var r;
      var relationfunc = function (t2) {
        var a = data[t2];
        t2 = type2 + '.' + t2;
        if (Array.isArray(a)) {
          keywords[t2] = a.join('|') + (keywords[t2] ? '|' + keywords[t2] : '');
          for (var i = a.length; i--;) {
            PMLTQMode.$highlightRules.addNewRule('start', t2, '\\b' + a[i] + '\\b');
            completions[a[i] + '#' + t2] = [a[i], t2, t2];

          }
        } else {
          relations.push([a, t2]);
        }
      };
      Object.keys(completions).forEach(function (k) {
        PMLTQMode.$completer.addCompletion(completions[k][0], completions[k][1], completions[k][2]);
      });
      while (r = relations.shift()) {
        var data = r[0];
        var type2 = r[1];
        Object.keys(data).forEach(relationfunc);
      }
      PMLTQMode.$highlightRules.addDefaultPopRule('step');
      PMLTQMode.$highlightRules.addKeywords(keywords);
      PMLTQMode.$tokenizer = null;
      modeCache.put(treebank.id, PMLTQMode);
      return PMLTQMode;
    }

  return buildPmltqMode;
});
