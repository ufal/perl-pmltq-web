'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var $ = require('gulp-load-plugins')();
var wrench = require('wrench');

var options = {
  src: 'app',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.js$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

