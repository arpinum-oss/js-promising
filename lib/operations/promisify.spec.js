'use strict';

const promisify = require('./promisify');

describe('Promisify', () => {

  it('should resolve the value in callback', () => {
    const func = (callback) => {
      setTimeout(() => {
        callback(null, 'hello');
      });
    };

    const promisified = promisify(func);

    return promisified().then(result => {
      result.should.equal('hello');
    });
  });

  it('should reject the error in callback', () => {
    const func = (callback) => {
      setTimeout(() => {
        callback(new Error('bleh'));
      });
    };

    const promisified = promisify(func);

    return promisified().then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh'));
  });
});
