module.exports = function () {
  'ngInject';

  function getHostname(str) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    return str.match(re)[1].toString();
  }

  return function (text) {
    return text && getHostname(text);
  };
};
