'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var glob = require('glob');
var log = require('gulp-util').log;
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

module.exports = function(options) {

  var jsSources = [options.src + '/*.js', options.src + '/**/*.js'];

  gulp.task('scripts', function () {
    return gulp.src(jsSources)
      .pipe($.if(args.verbose, $.print()))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'))
      .pipe($.jscs());
  });

  gulp.task('scripts:watch', function () {
    return gulp.src(jsSources)
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jscs())
      .pipe(browserSync.reload({ stream: true }));
  });

  /**
   * Create a visualizer report
   */
  gulp.task('plato', function(done) {
    log('Analyzing source with Plato');
    log('Browse to /report/plato/index.html to see Plato results');
    log('Running Plato');

    var files = glob.sync(options.src + '/**/*.js');
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var platoOptions = {
      title: 'Plato Inspections Report',
      exclude: excludeFiles
    };
    var outputDir = 'report/plato';

    plato.inspect(files, outputDir, platoOptions, platoCompleted);

    function platoCompleted(report) {
      var overview = plato.getOverviewReport(report);
      if (args.verbose) {
        log(overview.summary);
      }
      if (done) { done(); }
    }
  });
};
