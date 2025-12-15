module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    browsers: ['FirefoxHeadless'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },
    singleRun: true
  });
};
