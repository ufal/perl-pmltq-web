'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var RewriteImportPlugin = require('less-plugin-rewrite-import');
var path = require('path');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('styles', function () {
    var lessOptions = {
      paths: [
        path.join('bower_components', 'semantic-ui', 'src'),
        options.src
      ],
      plugins: [new RewriteImportPlugin({
        paths: {
          '../../theme.config': path.join(options.src, 'theme.config'),
          'app/theme/globals/site': path.join(options.src, 'theme', 'globals', 'site')
        }
      })]
    };

    var moduleFiles = /.*\/([^\/]+)\/\1\.less$/;

    var injectFiles = gulp.src([
      options.src + '/**/*.less'
    ], {read: false}).pipe($.sort());

    var injectIndexOptions = {
      transform: function(filePath) {
        if (filePath.match(moduleFiles)) {
          filePath = filePath.replace(options.src + '/', '');
          return '@import \'' + filePath + '\';';
        }
        return false;
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var injectModuleOptions = {
      transform: function(filePath, file) {
        if (!file.path.match(moduleFiles) && filePath.slice(0, 2) !== '..') {
          return '@import \'' + filePath + '\';';
        }
        return false;
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false,
      relative: true
    };

    var indexFilter = $.filter('pmltq.less');
    var moduleFilter = $.filter(function(file) {
      return moduleFiles.test(file.path);
    });

    return gulp.src([
      options.src + '/pmltq.less',
      options.src + '/*/*.less'
    ])
    .pipe(moduleFilter)
    .pipe($.inject(injectFiles, injectModuleOptions))
    .pipe(gulp.dest(options.src + '/'))
    .pipe(moduleFilter.restore())
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectIndexOptions))
    .pipe(gulp.dest(options.src + '/'))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(options.tmp + '/serve/'))
    .pipe(browserSync.reload({stream: true}));
  });
};
