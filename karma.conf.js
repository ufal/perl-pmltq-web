'use strict';

module.exports = function(config) {

  var configuration = {
    frameworks: ['jasmine'],

    ngHtml2JsPreprocessor: {
      stripPrefix: '.tmp/serve/',
      moduleName: 'pmltq.shared'
    },

    reporters : 'dots',

    logLevel : 'info',

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-mocha-reporter',
      'karma-notify-reporter'
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
