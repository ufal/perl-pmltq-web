// Inspired by https://github.com/jasny/bootstrap/blob/master/js/offcanvas.js
angular.module('pmltqWeb').factory('offCanvas',function($, $http, $timeout, $compile, $templateCache, $document, $rootScope) {

  var defaults = {
    template: '',
    container: false,
    canvas: false,
    placement: 'left',
    autohide: true,
    recalc: true,
    disableScrolling: true,
    toggle: false
  };

  var forEach = angular.forEach;

  var fetchPromises = {};
  function fetchTemplate(template) {
    if(fetchPromises[template]) {
      return fetchPromises[template];
    }
    return (fetchPromises[template] = $http.get(template, {cache: $templateCache}).then(function(res) {
      return res.data;
    }));
  }

  function OffCanvasFactory(config) {
    var offCanvas = {};

    var options = offCanvas.options = angular.extend({}, defaults, config);
    var Constructor = $.fn.offcanvas.Constructor;

    var offCanvasElement, offCanvasLinker, offCanvasObject;
    offCanvas.promise = fetchTemplate(options.template);
    var scope = offCanvas.scope = options.scope && options.scope.$new() || $rootScope.$new();
    if(!options.container) {
      options.container = 'body';
    }

    offCanvas.promise.then(function(template) {
      offCanvasLinker = $compile(template);
      offCanvas.init();
    });

    forEach(['hide', 'show', 'toggle'], function(func) {
      scope[func] = function() {
        scope.$$postDigest(function() {
          offCanvas[func]();
        });
      };
    });

    offCanvas.isShown = function() {
      return offCanvasObject && offCanvasObject.state === 'slid';
    };

    offCanvas.init = function() {
      if(options.show) {
        scope.$$postDigest(function() {
          offCanvas.show();
        });
      }
    };

    offCanvas.destroy = function() {
      if (offCanvasElement) {
        offCanvasElement.remove();
        offCanvasElement = null;
      }

      scope.$destroy();
    };

    offCanvas.show = function() {
      if (offCanvas.isShown()) {
        return;
      }

      if (offCanvasObject) {
        offCanvasObject.show();
        return;
      }

      if (!angular.isElement(options.container)) {
        options.container = $(options.container);
      }

      offCanvasElement = offCanvasLinker(scope, angular.noop);
      options.container.prepend(offCanvasElement);

      options.toggle = true; // will show
      offCanvasObject = new Constructor(offCanvasElement, options);
    };

    offCanvas.hide = function() {
      if (!offCanvasObject) {
        return;
      }

      offCanvasObject.hide();
    };

    offCanvas.toggle = function() {
      offCanvas[offCanvas.isShown() ? 'hide' : 'show']();
    };

    return offCanvas;
  }

  return OffCanvasFactory;
});
