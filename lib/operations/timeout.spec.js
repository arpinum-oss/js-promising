'use strict';

const timeout = require('./timeout');

describe('Timeout', () => {
  context('creates a function that', () => {
    it('should reject when function takes to much time', () => {
      const slowFunction = () => new Promise(() => undefined);
      const withTimeout = timeout(10, slowFunction);

      const result = withTimeout();

      return result.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('Timeout expired (10ms)')
      );
    });

    it('should resolve when function is quick enough', () => {
      const quickFunction = () => new Promise(resolve => setTimeout(() => resolve('ok'), 10));
      const withTimeout = timeout(100, quickFunction);

      const result = withTimeout();

      return result.then(result => {
        result.should.equal('ok');
      });
    });

    it('should forward promise rejection', () => {
      const failingFunction = () => new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('Failure sorry')), 10));
      const withTimeout = timeout(100, failingFunction);

      const result = withTimeout();

      return result.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('Failure sorry')
      );
    });
  });

  it('should pass all arguments to the created function', () => {
    const func = (...args) => new Promise(resolve => setTimeout(() => resolve([...args]), 10));
    const withTimeout = timeout(100, func);

    const result = withTimeout('hello', 'world');

    return result.then(args => {
      args.should.deep.equal(['hello', 'world']);
    });
  });
});
