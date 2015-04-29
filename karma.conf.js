'use strict';

var wiredep = require('wiredep');
var bowerDeps = wiredep({
  directory: 'bower_components',
  dependencies: true,
  devDependencies: true
});

var files = [];

bowerDeps.js.forEach(function(file) {
  files.push({pattern: __dirname + '/' + file, included: true, served: true, watched: false});
});

files.push('app/**/*.js');

module.exports = function(config) {

  var configuration = {
    frameworks: ['angular-filesort', 'jasmine'],

    ngHtml2JsPreprocessor: {
      stripPrefix: '.tmp/serve/',
      moduleName: 'pmltq.shared'
    },

    files: files,

    angularFilesort: {
      whitelist: [
        'app/**/*.js', '!app/**/*.(spec|mock).js'
      ]
    },

    reporters : 'dots',

    logLevel : 'info',

    browsers : ['PhantomJS'],

    plugins : [
      'karma-angular-filesort',
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-ng-html2js-preprocessor',
      'karma-notify-reporter',
      'karma-phantomjs-launcher'
    ],

    // reporter options
    mochaReporter: {
      output: 'autowatch'
    },

    preprocessors: {
      '.tmp/serve/**/*.html': ['ng-html2js']
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
