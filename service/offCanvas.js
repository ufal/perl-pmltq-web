angular.module('pmltqWeb').factory('offCanvas',function($http, $compile, $templateCache, $document, $rootScope) {

  var defaults = {
    template: '',
    container: false,
    canvas: false,
    placement: 'left',
    autohide: true,
    recalc: true,
    disableScrolling: true,
    show: false
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

    var offCanvasElement, offCanvasLinker, element;
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

      if (element) {
        element.remove();
        element = null;
      }

      scope.$destroy();
    };

    offCanvas.show = function() {
      if (offCanvas.isShown) {
        return;
      }

      if (offCanvasElement) {
        offCanvasElement.data('bs.offcanvas').show();
        offCanvas.isShown = true;
        return;
      }

      if (!angular.isElement(options.container)) {
        options.container = $(options.container);
      }

      offCanvasElement = offCanvasLinker(scope, angular.noop);
      element = $('<a/>').hide();
      offCanvasElement.append(element);
      options.container.prepend(offCanvasElement);

      options.target = offCanvasElement;
      offCanvasElement.offcanvas(options);
      if (options.show) {
        offCanvas.isShown = true;
      }
    };

    offCanvas.hide = function() {
      if (!offCanvas.isShown) {
        return;
      }

      offCanvasElement.data('bs.offcanvas').hide();
      offCanvas.isShown = false;
    };

    offCanvas.toggle = function() {
      if (offCanvas.isShown) {
        offCanvas.hide();
      } else {
        offCanvas.show();
      }
    };

    return offCanvas;
  }

  return OffCanvasFactory;
});
