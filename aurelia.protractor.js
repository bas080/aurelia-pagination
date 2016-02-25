exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'chrome'
  },
  onPrepare: function() {
    browser.ignoreSynchronization = true;

    by.addLocator('valueBind', function (bindingModel, opt_parentElement) {
      var using = opt_parentElement || document;
      var matches = using.querySelectorAll('*[value\\.bind="' + bindingModel +'"]');
      var result = undefined;

      if (matches.length === 0) {
        result = null;
      } else if (matches.length === 1) {
        result = matches[0];
      } else {
        result = matches;
      }

      return result;
    });
  },

  specs: ['specs/e2e/dist/*.js'],

  //Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
