'use strict';

const wrap = require('./wrap');

describe('Wrap', () => {

  it('should resolve the immediate value', () => {
    const func = () => 'hello';

    return wrap(func).then(result => {
      result.should.equal('hello');
    });
  });

  it('should reject an error', () => {
    const func = () => {
      throw new Error('bleh');
    };

    return wrap(func).then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh'));
  });

  it('should resolve a resolved value', () => {
    const func = () => new Promise(resolve => setTimeout(() => resolve('hello')));

    return wrap(func).then(result => {
      result.should.equal('hello');
    });
  });

  it('should reject a rejection', () => {
    const func = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('bleh'))));

    return wrap(func).then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh'));
  });
});
