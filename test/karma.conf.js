// Karma configuration
// Generated on Sat Mar 14 2015 13:11:54 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    // App Dependencies
      'http://code.jquery.com/jquery-2.1.1.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.js',
      'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.3.1/lodash.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.11.2/ui-bootstrap-tpls.min.js',
      './app/js/lib/datetimepicker-tpls-0.11.js',
      './app/js/lib/multi-select.js',

    // App Files
      './app/js/app.js',
      './app/js/directives.js',
      './app/js/filters.js',
      './app/js/services.js',
      './app/js/controllers/*.js',

    // Unit Test Dependencies
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-mocks.js',

    // Unit Tests
      './test/unit/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
