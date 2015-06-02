'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var url = require('url');
var proxy = require('proxy-middleware');

/*
 * Location of backend server
 */
var proxyOptions = url.parse('http://localhost:9090/v1');
proxyOptions.route = '/api';

var util = require('util');
var definedBrowser = process.env.BROWSER;

module.exports = function(options) {

  function browserSyncInit(baseDir) {
    var browser = definedBrowser ? definedBrowser : undefined;

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components',
        '/static': 'static'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes,
      middleware: [proxy(proxyOptions)]
    };

    browserSync.instance = browserSync.init({
      startPath: '/',
      notify: false,
      reloadDebounce: 1000,
      server: server,
      browser: browser
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve', ['watch'], function () {
    browserSyncInit([options.tmp + '/serve', options.src]);
  });

  gulp.task('serve:dist', ['build'], function () {
    browserSyncInit(options.dist);
  });

  gulp.task('serve:e2e', ['inject'], function () {
    browserSyncInit([options.tmp + '/serve', options.src]);
  });

  gulp.task('serve:e2e-dist', ['build'], function () {
    browserSyncInit(options.dist);
  });
};
