export default function (app) {

  app.filter('hostname', require('./filters/hostname'));
}
