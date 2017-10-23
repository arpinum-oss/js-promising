'use strict';

const delay = require('./delay');

describe('Delay', () => {
  it('should resolve after the given ms', () => {
    return delay(1);
  });

  it('should passe all arguments to the created function', () => {
    const func = (...args) => args;
    const withDelay = delay(10, func);

    const result = withDelay('hello', 'world');

    return result.then(args => {
      args.should.deep.equal(['hello', 'world']);
    });
  });

  context('creates a function that', () => {
    it('should resolve after the delay', () => {
      const func = () => 'ok';
      const withDelay = delay(10, func);

      const result = withDelay();

      return result.then(result => {
        result.should.equal('ok');
      });
    });
  });
});
