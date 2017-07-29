'use strict';

const delay = require('./delay');

describe('Delay', () => {

  it('should resolve after the given ms', () => {
    return delay(1);
  });
});
