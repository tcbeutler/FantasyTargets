'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('True', function() {

  it('should be true', function() {
    browser().navigateTo('');
    expect(browser().location().url()).toBe('');
  });
});
