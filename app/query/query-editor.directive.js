var app = angular.module('pmltq.query')
  .directive('queryEditor', function (pmltqMode) {
    if (angular.isUndefined(window.ace)) {
      throw new Error('query-editor need ace to work... (o rly?)');
    }

    var setOptions = function(acee, session, opts, treebank, elm) {
      var PMLTQMode;
      if (angular.isDefined(opts.treebank)) {
        treebank = opts.treebank;
      }
      if (angular.isDefined(opts.readonly) && opts.readonly) {
        acee.setOptions({
          readOnly: true,
          highlightActiveLine: false,
          highlightGutterLine: false
        });
        acee.renderer.$cursorLayer.element.style.opacity = 0;
        acee.textInput.getElement().disabled = true;
      }
      acee.setTheme('ace/theme/pmltq');
      acee.setOptions({
        showGutter: false,
        highlightActiveLine: true,
        highlightGutterLine: true,
        tabSize: 2,
        useSoftTabs: true,
        fontSize: 14,
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
      PMLTQMode = pmltqMode(treebank); //pmltqModeInit(treebank);
      acee.session.setMode(PMLTQMode);

      if (angular.isDefined(opts.adjustheight) && opts.adjustheight) {
        acee.on('change', function() {
          var newHeight = session.getScreenLength() * acee.renderer.lineHeight + acee.renderer.scrollBar.getWidth();
          elm.height(newHeight.toString() + 'px');
          acee.resize();
        });
      }
      if (angular.isDefined(opts.query)) {
        acee.setValue(opts.query, 1);
      }
      acee.session.bgTokenizer.setTokenizer(PMLTQMode.getTokenizer(PMLTQMode.$highlightRules.getRules()));
      acee.session.bgTokenizer.start(0);
    };

    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options = {};
        var opts = angular.extend({}, scope.$eval(attrs.queryEditor));
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

          setOptions(acee, session, opts, scope.treebank, elm);
        };

        scope.$watch(attrs.queryEditor, updateOptions, /* deep watch */ true);

        // set the options here, even if we try to watch later, if this
        // line is missing things go wrong (and the tests will also fail)
        updateOptions(options);
        elm.editor = acee;
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
  });
