var app = angular.module('pmltq.query')
  .constant('pmltqAceConfig', {})
  .directive('queryEditor', ['pmltqAceConfig', function (pmltqAceConfig) {
    if (angular.isUndefined(window.ace)) {
      throw new Error('query-editor need ace to work... (o rly?)');
    }

    var setOptions = function(acee, session, opts, treebank) {
      var defKeywords = 'for|give|distinct|sort|by|desc|asc|filter|where|over|all'.split('|');
      var functions = {
        FUNC: ('descendants|lbrothers|rbrothers|sons|depth_first_order|order_span_min|order_span_max|depth|lower' +
        '|upper|length|substr|tr|replace|substitute|match|ceil|floor|round|trunc|percnt|name|type_of|id|file|tree_no' +
        '|address|abs|exp|power|log|sqrt|ln').split('|'),
        AFUNC: 'min|max|sum|avg|count|ratio|concat|row_number|rank|dense_rank'.split('|')
      };
      if (angular.isDefined(opts.treebank)) {
        treebank = opts.treebank;
      }
      if (angular.isDefined(opts.readonly)) {
        acee.setReadOnly(opts.readonly);
      }
      acee.setTheme('ace/theme/pmltq');
      acee.setOptions({
        showGutter: false,
        // hides line numbers with background
        displayIndentGuides: false,
        showPrintMargin: false,
        // hides 80 char rule - dont work
        //completing
        enableBasicAutocompletion: true,
        // enableSnippets: true, //complete after tab press
        enableLiveAutocompletion: true
      });
      acee.$blockScrolling = Infinity;
      acee.session.setMode('ace/mode/pmltq');
      var PMLTQMode =   acee.session.$mode;
      var keywords = {};
      Object.keys(functions).forEach(function(type) {
        var a = functions[type];
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addNewRule('start', [type, 'PAR'], '(\\b' + a[i] + '\\b)(\\()');
          PMLTQMode.$completer.addCompletion(a[i], type, type);
        }
      });

      var type = 'KEYWORD';
      keywords[type] = defKeywords.join('|') + (keywords[type] ? '|' + keywords[type] : '');
      for (var i = defKeywords.length; i--;) {
        PMLTQMode.$highlightRules.addNewRule('start', type, '\\b' + defKeywords[i] + '\\b');
        PMLTQMode.$completer.addCompletion(defKeywords[i], type, type);
      }

      // jscs:disable requireDotNotation
      Object.keys(treebank['node_types']).forEach(function(type) {
        var a = treebank['node_types'][type];
        type = 'TYPE.' + type;
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addNewRule('start', type, '\\b' + a[i] + '\\b');
          PMLTQMode.$completer.addCompletion(a[i], type, type);
        }
      });
      // jscs:enable requireDotNotation

      Object.keys(treebank.attributes).forEach(function(type) {
        var a = treebank.attributes[type];
        keywords[type] = a.join('|') + (keywords[type] ? '|' + keywords[type] : '');
        for (var i = a.length; i--;) {
          PMLTQMode.$highlightRules.addAtributes(type, a[i]);
          PMLTQMode.$completer.addCompletion(a[i], 'ATTRIBUTE.' + type, 'ATTRIBUTE.' + type);
        }
      });

      var relations = [[treebank.relations, 'RELATION']];
      var r;
      var relationfunc = function(t2) {
        var a = data[t2];
        t2 = type2 + '.' + t2;
        if (Array.isArray(a)) {
          keywords[t2] = a.join('|') + (keywords[t2] ? '|' + keywords[t2] : '');
          for (var i = a.length; i--;) {
            PMLTQMode.$highlightRules.addNewRule('start', t2, '\\b' + a[i] + '\\b');
            PMLTQMode.$completer.addCompletion(a[i], t2, t2);
          }
        } else {
          relations.push([a, t2]);
        }
      };
      while (r = relations.shift()) {
        var data = r[0];
        var type2 = r[1];
        Object.keys(data).forEach(relationfunc);
      }
      PMLTQMode.$highlightRules.addDefaultPopRule('step');

      PMLTQMode.$highlightRules.addKeywords(keywords);
      PMLTQMode.$tokenizer = null; // force recreation of tokenizer
      acee.session.bgTokenizer.setTokenizer(PMLTQMode.getTokenizer(PMLTQMode.$highlightRules.getRules()));
      acee.session.bgTokenizer.start(0);
    };

    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options = pmltqAceConfig.ace || {};
        var opts = angular.extend({}, options, scope.$eval(attrs.queryEditor));
        var acee = window.ace.edit(elm[0]);
        var session = acee.getSession();
        var onChangeListener;
        var onBlurListener;
        var executeUserCallback = function () {
          var callback = arguments[0];
          var args = Array.prototype.slice.call(arguments, 1);

          if (angular.isDefined(callback)) {
            scope.$evalAsync(function () {
              if (angular.isFunction(callback)) {
                callback(args);
              } else {
                throw new Error('ui-ace use a function as callback.');
              }
            });
          }
        };
        var listenerFactory = {
          onChange: function (callback) {
            return function (e) {
              var newValue = session.getValue();

              if (ngModel && newValue !== ngModel.$viewValue &&
                  // HACK make sure to only trigger the apply outside of the
                  // digest loop 'cause ACE is actually using this callback
                  // for any text transformation !
                !scope.$$phase && !scope.$root.$$phase) {
                scope.$evalAsync(function () {
                  ngModel.$setViewValue(newValue);
                });
              }

              executeUserCallback(callback, e, acee);
            };
          },
          onBlur: function (callback) {
            return function () {
              executeUserCallback(callback, acee);
            };
          }
        };

        attrs.$observe('readonly', function (value) {
          acee.setReadOnly(!!value || value === '');
        });

        // Value Blind
        if (ngModel) {
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            }
            else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-ace cannot use an object or an array as a model');
            }
            return value;
          });

          ngModel.$render = function () {
            session.setValue(ngModel.$viewValue);
          };
        }

        // Listen for option updates
        var updateOptions = function (current, previous) {
          if (current === previous) {return;}
          opts = angular.extend({}, options, scope.$eval(attrs.queryEditor));

          opts.callbacks = [opts.onLoad];
          if (opts.onLoad !== options.onLoad) {
            // also call the global onLoad handler
            opts.callbacks.unshift(options.onLoad);
          }

          // EVENTS

          // unbind old change listener
          session.removeListener('change', onChangeListener);

          // bind new change listener
          onChangeListener = listenerFactory.onChange(opts.onChange);
          session.on('change', onChangeListener);

          // unbind old blur listener
          //session.removeListener('blur', onBlurListener);
          acee.removeListener('blur', onBlurListener);

          // bind new blur listener
          onBlurListener = listenerFactory.onBlur(opts.onBlur);
          acee.on('blur', onBlurListener);

          setOptions(acee, session, opts, scope.treebank);
        };

        scope.$watch(attrs.queryEditor, updateOptions, /* deep watch */ true);

        // set the options here, even if we try to watch later, if this
        // line is missing things go wrong (and the tests will also fail)
        updateOptions(options);

        elm.on('$destroy', function () {
          acee.session.$stopWorker();
          acee.destroy();
        });

        scope.$watch(function() {
          return [elm[0].offsetWidth, elm[0].offsetHeight];
        }, function() {
          acee.resize();
          acee.renderer.updateFull();
        }, true);

      }
    };
  }
  ]);
