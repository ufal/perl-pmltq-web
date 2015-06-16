/* @ngInject */
function ModalFactory($, $rootScope, $controller, $compile, $timeout, uiUtils) {
  function Modal(config) {
    if (!(this instanceof Modal)) {
      return new Modal(config);
    }

    this.config = config = angular.extend({}, config);
    var modal = this,
      promise = modal.promise = uiUtils.fetchTemplate(config.template),
      controller = config.controller,
      controllerAs = config.controllerAs,
      scope = modal.scope = config.scope ? config.scope : $rootScope.$new(),
      onHide = config.onHide, onVisible = config.onVisible;

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

    promise.then(function (template) {
      modal.modalLinker = $compile(template);
      if (controller) {
        var ctrl = $controller(controller, {$scope: scope});
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
      }
      modal.init();
    });
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

    //uiUtils.safeDigest(this.scope);
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
}

angular
  .module('semanticUI')
  .factory('uiModal', ModalFactory);
