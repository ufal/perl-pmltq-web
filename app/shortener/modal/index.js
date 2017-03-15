module.exports = function ShortenerModalFactory(uiModal, shortener) {
  'ngInject';

  function ShortenerModal(url, title) {
    //noinspection JSUnusedGlobalSymbols
    var m = uiModal({
      template: require('./template.jade'),
      controller: require('./controller'),
      controllerAs: 'vm',
      locals: {url: url, title: title},
      closable: true,
      onHidden: function () {
        m.destroy();
        m = null;
      }
    });

    return m;
  }

  return ShortenerModal;
};
