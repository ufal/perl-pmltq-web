var angular = require('angular');
var $ = require('jquery');

module.exports = function ModalFactory($rootScope, $controller, $compile, $timeout, uiUtils) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  function Modal(config) {
    if (!(this instanceof Modal)) {
      return new Modal(config);
    }

    this.config = config = angular.extend({}, config);
    var modal = this,
      template = _.isFunction(config.template) ? config.template() : config.template,
      controller = config.controller,
      controllerAs = config.controllerAs,
      scope = modal.scope = config.scope ? config.scope : $rootScope.$new(),
      onHide = config.onHide, onVisible = config.onVisible,
      locals = config.locals;

    config.onHide = function () {
      if (onHide) {
        onHide();
      }
      scope.isShown = modal.isShown = scope.isVisible = modal.isVisible = false;
      uiUtils.safeDigest(scope);
    };

    config.onVisible = function () {
      if (onVisible) {
        onVisible();
      }

      scope.isVisible = modal.isVisible = true;
      modal.modalElement.modal('refresh');
      uiUtils.safeDigest(scope);
    };

    delete config.template;
    delete config.scope;

    scope.hide = function() {
      scope.$$postDigest(function() {
        modal.hide();
      });
    };

    scope.show = function() {
      scope.$$postDigest(function() {
        modal.show();
      });
    };

    scope.toggle = function() {
      scope.$$postDigest(function() {
        modal.toggle();
      });
    };

    modal.modalLinker = $compile(template);
    if (controller) {
      if (!locals) {
        locals = {};
      }
      locals.$scope = scope;
      var ctrl = $controller(controller, locals);
      if (controllerAs) {
        scope[controllerAs] = ctrl;
      }
    } else if (locals) {
      for (var prop in locals) {
        if (locals.hasOwnProperty(prop)) {
          scope[prop] = locals[prop];
        }
      }
    }
    modal.init();
  }

  Modal.prototype.init = function () {
    if (this.config.show) {
      this.scope.show();
    }
  };

  Modal.prototype.destroy = function () {
    if (this.modalElement) {
      this.modalElement.modal('destroy');
      this.modalElement.remove();
      this.modalElement = null;
    }

    this.scope.$destroy();
  };

  Modal.prototype.show = function () {
    var modal = this;
    if (modal.isShown) {
      return;
    }

    if (!modal.modalElement) {
      modal.modalElement = $(modal.modalLinker(modal.scope));
      modal.modalElement.appendTo($('body'));
      modal.modalElement.modal(modal.config);
    }

    // This is here to fix the animations
    $timeout(function () {
      modal.modalElement.modal('show');
      modal.scope.isShown = modal.isShown = true;
    });
  };

  Modal.prototype.hide = function () {
    this.modalElement.modal('hide');
  };

  Modal.prototype.toggle = function () {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  };

  Modal.prototype.refresh = function() {
    var modal = this;
    $timeout(function () {
      modal.modalElement.modal('refresh');
    });
  };

  return Modal;
};
