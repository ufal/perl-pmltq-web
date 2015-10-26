var angular = require('angular');
var ace = require('brace');

require('./queryEditor.less');

module.exports = function ($parse, pmltqModeBuilder) {
  'ngInject';

  const DEFAULT_OPTIONS = {
    showGutter: false,
    highlightActiveLine: true,
    highlightGutterLine: true,
    tabSize: 2,
    useSoftTabs: true,
    fontSize: 14,
    minLines: 7,
    maxLines: 40,
    // hides line numbers with background
    displayIndentGuides: false,
    showPrintMargin: false,
    // hides 80 char rule - dont work
    //completing
    enableBasicAutocompletion: true,
    // enableSnippets: true, //complete after tab press
    enableLiveAutocompletion: true
  };
  const theme = require('../ace/pmltq/theme');

  function setOptions(aceInstance, session, opts, treebank, elm) {
    if (angular.isDefined(opts.treebank)) {
      treebank = opts.treebank;
    }
    if (angular.isDefined(opts.readonly) && opts.readonly) {
      aceInstance.setOptions({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
      });
      aceInstance.renderer.$cursorLayer.element.style.opacity = 0;
      aceInstance.textInput.getElement().disabled = true;
    }
    aceInstance.setTheme(theme);
    aceInstance.setOptions(DEFAULT_OPTIONS);
    aceInstance.$blockScrolling = Infinity;

    var mode = pmltqModeBuilder(treebank);
    session.setMode(mode);

    if (angular.isDefined(opts.adjustheight) && opts.adjustheight) {
      aceInstance.on('change', function () {
        var newHeight = session.getScreenLength() * aceInstance.renderer.lineHeight + aceInstance.renderer.scrollBar.getWidth();
        elm.height(newHeight.toString() + 'px');
        aceInstance.resize();
      });
    }

    if (angular.isDefined(opts.query)) {
      aceInstance.setValue(opts.query, 1);
    }

    session.bgTokenizer.setTokenizer(mode.getTokenizer(mode.$highlightRules.getRules()));
    session.bgTokenizer.start(0);
  }

  return {
    restrict: 'EA',
    require: '?ngModel',
    link: function ($scope, $element, $attrs, ngModel) {
      var options = {};
      var opts = angular.extend({}, $scope.$eval($attrs.queryEditor));
      var aceInstance = ace.edit($element[0]);
      var session = aceInstance.getSession();
      var onChangeListener;
      var onBlurListener;
      var executeUserCallback = function () {
        var callback = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);

        if (angular.isDefined(callback)) {
          $scope.$evalAsync(function () {
            if (angular.isFunction(callback)) {
              callback(args);
            } else {
              throw new Error('queryEditor use a function as callback.');
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
              !$scope.$$phase && !$scope.$root.$$phase) {
              $scope.$evalAsync(function () {
                ngModel.$setViewValue(newValue);
              });
            }

            executeUserCallback(callback, e, aceInstance);
          };
        },
        onBlur: function (callback) {
          return function () {
            executeUserCallback(callback, aceInstance);
          };
        }
      };
      var editorSetter = null;

      if ($attrs.editor) {
        editorSetter = $parse($attrs.editor).assign;
        editorSetter($scope, aceInstance);
      }

      $attrs.$observe('readonly', function (value) {
        aceInstance.setReadOnly(!!value || value === '');
      });

      // Value Blind
      if (ngModel) {
        ngModel.$formatters.push(function (value) {
          if (angular.isUndefined(value) || value === null) {
            return '';
          }
          else if (angular.isObject(value) || angular.isArray(value)) {
            throw new Error('queryEditor cannot use an object or an array as a model');
          }
          return value;
        });

        ngModel.$render = function () {
          session.setValue(ngModel.$viewValue);
        };
      }

      // Listen for option updates
      function updateOptions(current, previous) {
        if (current === previous) {
          return;
        }
        opts = angular.extend({}, options, $scope.$eval($attrs.queryEditor));

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
        aceInstance.removeListener('blur', onBlurListener);

        // bind new blur listener
        onBlurListener = listenerFactory.onBlur(opts.onBlur);
        aceInstance.on('blur', onBlurListener);

        setOptions(aceInstance, session, opts, $scope.treebank, $element);
      }

      $scope.$watch($attrs.queryEditor, updateOptions, /* deep watch */ true);

      // set the options here, even if we try to watch later, if this
      // line is missing things go wrong (and the tests will also fail)
      updateOptions(options);
      $element.editor = aceInstance;
      $element.on('$destroy', function () {
        aceInstance.session.$stopWorker();
        if (aceInstance.completer) {
          aceInstance.completer.detach();
        }
        aceInstance.destroy();
        if (editorSetter) {
          editorSetter($scope, null);
        }
      });

      $scope.$watch(function () {
        return [$element[0].offsetWidth, $element[0].offsetHeight];
      }, function () {
        aceInstance.resize();
        aceInstance.renderer.updateFull();
      }, true);
    }
  };
};
