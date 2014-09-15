grunt.loadNpmTasks('grunt-bower-concat');

grunt.initConfig({
  bower_concat: {
    all: {
    dest: 'build/_bower.js',
    exclude: [
      'jquery',
      'modernizr'
    ],
    dependencies: {
      'underscore': 'jquery',
      'backbone': 'underscore',
    },
    bowerOptions: {
      relative: false
    }
    }
  }
  });