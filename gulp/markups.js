'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var _ = require('lodash');

module.exports = function(options) {

  function compileJade() {
    function renameToHtml(path) {
      path.extname = '.html';
    }

    var seenHash = {};
    var injectFilter = $.filter(function(file) {
      if (!seenHash[file.relative]) {
        seenHash[file.relative] = true;
        return file;
      }
    });

    return gulp.src([options.inject + '/**/*.jade', options.src + '/**/*.jade'])
      .pipe(injectFilter)
      .pipe($.cached('jade'))
      .pipe($.consolidate('jade', function (file) {
        var data = {basedir: options.src, doctype: 'html', pretty: '  '};
        var ext = path.extname(file.path);
        var ymlFile = file.path.substr(0, file.path.length - ext.length) + '.yml';
        return fs.existsSync(ymlFile) ? _.extend(data, yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'))) : data;
      })).on('error', options.errorHandler('Jade'))
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(options.tmp + '/serve/'))
      .pipe(browserSync.reload({stream: true}));
  }

  gulp.task('markups:watch', function() {
    return compileJade();
  });

  gulp.task('markups', ['inject'], function() {
    return compileJade();
  });
};
