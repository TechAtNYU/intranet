module.exports = function(config) {	
  config.set({

  	basePath : '../',
    files: [
      'test/unit/**/*.js',
      'public/js/**/*.js'
    ],

    autowatch: true,
    frameworks: ['jasmine']
  });
};