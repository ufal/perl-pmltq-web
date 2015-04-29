'use strict';

var gulp = require('gulp');
var karma = require('karma');

module.exports = function() {
  function runTests (singleRun, done) {
    karma.server.start({
      configFile: __dirname + '/../karma.conf.js',
      reporters: singleRun ? ['dots'] : ['notify', 'mocha'],
      singleRun: singleRun,
      autoWatch: !singleRun
    }, function(exitStatus) {
      if (singleRun) {
        done(exitStatus ? "There are failing unit tests" : undefined);
      } else {
        done(exitStatus);
      }
    });
  }

  gulp.task('test', ['scripts'], function(done) {
    runTests(true, done);
  });

  gulp.task('tdd', ['serve'], function(done) {
    runTests(false, done);
  });
};
