'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {

  function compileJade() {
    function renameToHtml(path) {
      path.extname = '.html';
    }

    var seenHash = {};
    var injectFilter = $.filter(function(file) {
      if (!seenHash[file.relative]) {
        seenHash[file.relative] = true;
        return file
      }
    });

    return gulp.src([options.inject + '/**/*.jade', options.src + '/**/*.jade'])
      .pipe(injectFilter)
      .pipe($.cached('jade'))
      .pipe($.consolidate('jade', { basedir: options.src, doctype: 'html', pretty: '  ' })).on('error', options.errorHandler('Jade'))
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(options.tmp + '/serve/'))
      .pipe(browserSync.reload({ stream: true }));
  }

  gulp.task('markups:watch', function() {
    return compileJade();
  });

  gulp.task('markups', ['inject'], function() {
    return compileJade();
  });
};
