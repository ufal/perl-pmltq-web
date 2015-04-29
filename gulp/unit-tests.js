'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function(options) {
  function listFiles(callback) {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      dependencies: true,
      devDependencies: true
    });

    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    var htmlFiles = [
      options.tmp + '/serve/**/*.html',
      options.src + '/**/*.html'
    ];

    gulp.src([options.src + '/*.js', options.src + '/**/*.js'])
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'))
      .pipe(concat(function(files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles));
      }));
  }

  function runTests (singleRun, done) {
    listFiles(function(files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        reporters: singleRun ? ['dots'] : ['notify', 'mocha'],
        singleRun: singleRun,
        autoWatch: !singleRun,
      }, function(exitStatus) {
        if (singleRun) {
          done(exitStatus ? "There are failing unit tests" : undefined);
        } else {
          done(exitStatus);
        }
      });
    });
  }

  gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
  });

  gulp.task('tdd', ['serve'], function(done) {
    runTests(false, done);
  });
};
