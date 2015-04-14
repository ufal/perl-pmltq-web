'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch', ['markups'], function () {

    gulp.watch([
      options.src + '/**/*.css',
      options.src + '/**/*.less'
    ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch([ options.src + '/**/*.js' ], function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts:watch');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.src + '/**/*.jade', ['markups:watch']);
  });
};
