'use strict';

const operations = require('./operations');

describe('Operations module', () => {

  context('when promisifying a function with node-like callback', () => {
    it('should resolve the value in callback', () => {
      const func = (callback) => {
        setTimeout(() => {
          callback(null, 'hello');
        });
      };

      const promisified = operations.promisify(func);

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

      const promisified = operations.promisify(func);

      return promisified().then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });
  });

  context('when trying a function', () => {
    it('should resolve the immediate value', () => {
      const func = () => 'hello';

      return operations.try(func).then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject an error', () => {
      const func = () => {
        throw new Error('bleh');
      };

      return operations.try(func).then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });

    it('should resolve a resolved value', () => {
      const func = () => new Promise(resolve => setTimeout(() => resolve('hello')));

      return operations.try(func).then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject a rejection', () => {
      const func = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('bleh'))));

      return operations.try(func).then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });
  });

  context('when mapping', () => {
    it('should resolve when all applied promises are resolved', () => {
      const globalPromise = operations.map([1, 2, 3], x => Promise.resolve(x));

      return globalPromise.then(result => {
        result.should.deep.equal([1, 2, 3]);
      });
    });

    it('should return results in same order than values', () => {
      const globalPromise = operations.map([1, 2, 3], decreasingDelay);

      return globalPromise.then(result => {
        result.should.deep.equal([1, 2, 3]);
      });

      function decreasingDelay(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), 30 / x));
      }
    });

    it('should reject if any promise is rejected', () => {
      const globalPromise = operations.map([1, 2, 3], rejectFor2, {concurrency: 3});

      return globalPromise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));

      function rejectFor2(x) {
        return x === 2 ? Promise.reject(new Error('bleh')) : undefined;
      }
    });

    it('should reject with first error', () => {
      const globalPromise = operations.map([1, 2, 3], rejectForGreaterThan2, {concurrency: 3});

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
      const func = () => operations.try(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      }).then(() => concurrentRuns--);
      const functions = new Array(50).fill().map(() => func);

      const globalPromise = operations.map(functions, f => f(), {concurrency: 4});

      return globalPromise.then(() => {
        maxConcurrentRuns.should.equal(4);
      });
    });
  });

  context('when mapping in series', () => {
    it('should run promises sequentially', () => {
      const runs = [];
      const functions = [
        () => operations.delay(20).then(() => {
          runs.push('1');
          return '1';
        }),
        () => operations.delay(10).then(() => {
          runs.push('2');
          return '2';
        }),
        () => operations.delay(1).then(() => {
          runs.push('3');
          return '3';
        })
      ];

      const globalPromise = operations.mapSeries(functions, f => f());

      return globalPromise.then(results => {
        results.should.deep.equal(['1', '2', '3']);
        runs.should.deep.equal(['1', '2', '3']);
      });
    });
  });

  context('when delaying', () => {
    it('should resolve after the given ms', () => {
      return operations.delay(1);
    });
  });

  context('when composeing', () => {
    it('should create a promise function of all functions', () => {
      const runs = [];
      const functions = [
        () => operations.delay(1).then(() => {
          runs.push('1');
        }),
        () => operations.delay(1).then(() => {
          runs.push('2');
        })
      ];

      const globalPromise = operations.compose(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should preserve order', () => {
      const runs = [];
      const functions = [
        () => operations.delay(20).then(() => {
          runs.push('1');
        }),
        () => operations.delay(1).then(() => {
          runs.push('2');
        })
      ];

      const globalPromise = operations.compose(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should supply return value of the previous function to the next', () => {
      const functions = [
        result => operations.delay(1).then(() => [...result, '1']),
        result => operations.delay(1).then(() => [...result, '2']),
        result => operations.delay(1).then(() => [...result, '3'])
      ];

      const globalPromise = operations.compose(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });

    it('should handle sync and async functions', () => {
      const functions = [
        result => [...result, '1'],
        result => [...result, '2'],
        result => operations.delay(1).then(() => [...result, '3'])
      ];

      const globalPromise = operations.compose(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });
  });
});
