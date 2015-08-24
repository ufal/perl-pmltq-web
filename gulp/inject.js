'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', ['constants', 'scripts', 'styles'], function () {

    var injectStyles = gulp.src([
      options.tmp + '/serve/**/*.css'
    ], {read: false});

    var injectScripts = gulp.src([
      options.src + '/**/*.js',
      options.tmp + '/serve/pmltq.config.js',
      '!' + options.src + '/**/*.spec.js',
      '!' + options.src + '/**/*.mock.js'
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      addRootSlash: false,
      ignorePath: [options.src, options.tmp + '/serve'],
      starttag: '// {{name}}:{{ext}}',
      endtag: '// endinject'
    };

    var wiredepOptions = {
      directory: 'bower_components',
      ignorePath: '../'
    };

    return gulp.src(options.src + '/*.jade')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.inject + '/'));
  });
};
