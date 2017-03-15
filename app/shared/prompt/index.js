module.exports = function PromptModalFactory(uiModal) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  function PromptModal(options, onSave) {
    var m = uiModal({
      template: require('./template.jade'),
      controller: require('./controller'),
      controllerAs: 'vm',
      closable: true,
      locals: {promptOptions: options, promptOnSave: onSave},
      onHidden: function () {
        m.destroy();
        m = null;
      }
    });

    return m;
  }

  return PromptModal;
};
