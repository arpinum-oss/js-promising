'use strict';

const wrap = require('./wrap');

describe('Wrap', () => {
  context('creates a function that', () => {
    it('should resolve the immediate value', () => {
      const func = () => 'hello';

      const promise = wrap(func)();

      return promise.then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject an error', () => {
      const func = () => {
        throw new Error('bleh');
      };

      const promise = wrap(func)();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });

    it('should resolve a resolved value', () => {
      const func = () => new Promise(resolve => setTimeout(() => resolve('hello')));

      const promise = wrap(func)();

      return promise.then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject a rejection', () => {
      const func = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('bleh'))));

      const promise = wrap(func)();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });
  });

  it('should pass all arguments to the created function', () => {
    const func = (...args) => args;

    const promise = wrap(func)(1, 2, 3);

    return promise.then(result => {
      result.should.deep.equal([1, 2, 3]);
    });
  });
});
