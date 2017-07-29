'use strict';

const wrap = require('./wrap');
const map = require('./map');

describe('Map', () => {

  it('should resolve when all applied promises are resolved', () => {
    const globalPromise = map([1, 2, 3], x => Promise.resolve(x));

    return globalPromise.then(result => {
      result.should.deep.equal([1, 2, 3]);
    });
  });

  it('should return results in same order than values', () => {
    const globalPromise = map([1, 2, 3], decreasingDelay);

    return globalPromise.then(result => {
      result.should.deep.equal([1, 2, 3]);
    });

    function decreasingDelay(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), 30 / x));
    }
  });

  it('should reject if any promise is rejected', () => {
    const globalPromise = map([1, 2, 3], rejectFor2, {concurrency: 3});

    return globalPromise.then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh'));

    function rejectFor2(x) {
      return x === 2 ? Promise.reject(new Error('bleh')) : undefined;
    }
  });

  it('should reject with first error', () => {
    const globalPromise = map([1, 2, 3], rejectForGreaterThan2, {concurrency: 3});

    return globalPromise.then(
      () => Promise.reject(new Error('Should fail')),
      rejection => rejection.message.should.equal('bleh2'));

    function rejectForGreaterThan2(x) {
      return x >= 2 ? Promise.reject(new Error(`bleh${x}`)) : undefined;
    }
  });

  it('should run promises with regards of concurrency', () => {
    let maxConcurrentRuns = 0;
    let concurrentRuns = 0;
    const func = () => wrap(() => {
      concurrentRuns++;
      maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
    }).then(() => concurrentRuns--);
    const functions = new Array(50).fill().map(() => func);

    const globalPromise = map(functions, f => f(), {concurrency: 4});

    return globalPromise.then(() => {
      maxConcurrentRuns.should.equal(4);
    });
  });
});
