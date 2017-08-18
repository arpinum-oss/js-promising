'use strict';

const delay = require('./delay');
const compose = require('./compose');

describe('Compose', () => {

  it('should create a promise function of all functions', () => {
    const runs = [];
    const functions = [
      () => delay(1).then(() => {
        runs.push('1');
      }),
      () => delay(1).then(() => {
        runs.push('2');
      })
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      runs.should.deep.equal(['1', '2']);
    });
  });

  it('should preserve order', () => {
    const runs = [];
    const functions = [
      () => delay(20).then(() => {
        runs.push('1');
      }),
      () => delay(1).then(() => {
        runs.push('2');
      })
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      runs.should.deep.equal(['1', '2']);
    });
  });

  it('should supply return value of the previous function to the next', () => {
    const functions = [
      result => delay(1).then(() => [...result, '1']),
      result => delay(1).then(() => [...result, '2']),
      result => delay(1).then(() => [...result, '3'])
    ];

    const globalPromise = compose(functions)(['initial']);

    return globalPromise.then(result => {
      result.should.deep.equal(['initial', '1', '2', '3']);
    });
  });

  it('should handle sync and async functions', () => {
    const functions = [
      result => [...result, '1'],
      result => [...result, '2'],
      result => delay(1).then(() => [...result, '3'])
    ];

    const globalPromise = compose(functions)(['initial']);

    return globalPromise.then(result => {
      result.should.deep.equal(['initial', '1', '2', '3']);
    });
  });

  it('should handle rejections', () => {
    const functions = [
      result => [...result, '1'],
      () => Promise.reject(new Error('bleh')),
      result => [...result, '3']
    ];

    const globalPromise = compose(functions)(['initial']);

    return globalPromise.then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh'));
  });

  it('should first function to have any number of arguments', () => {
    const add = (x, y) => Promise.resolve(x + y);
    const square = x => Promise.resolve(x * x);
    const addSquare = compose([add, square]);

    return addSquare(1, 2).then(result => {
      result.should.equal(9);
    });
  });
});
