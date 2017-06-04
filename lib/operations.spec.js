'use strict';

const operations = require('./operations');

describe('Operations module', () => {

  context('when promisifying a function with node-like callback', () => {
    it('should resolve the value in callback', () => {
      let func = (callback) => {
        setTimeout(() => {
          callback(null, 'hello');
        });
      };

      let promisified = operations.promisify(func);

      return promisified().then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject the error in callback', () => {
      let func = (callback) => {
        setTimeout(() => {
          callback(new Error('bleh'));
        });
      };

      let promisified = operations.promisify(func);

      return promisified().then(
        () => Promise.resolve(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });
  });

  context('when trying a function', () => {
    it('should resolve the immediate value', () => {
      let func = () => 'hello';

      return operations.try(func).then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject an error', () => {
      let func = () => {
        throw new Error('bleh');
      };

      return operations.try(func).then(
        () => Promise.resolve(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });

    it('should resolve a resolved value', () => {
      let func = () => new Promise(resolve => setTimeout(() => resolve('hello')));

      return operations.try(func).then(result => {
        result.should.equal('hello');
      });
    });

    it('should reject a rejection', () => {
      let func = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('bleh'))));

      return operations.try(func).then(
        () => Promise.resolve(new Error('Should fail')),
        rejection => rejection.message.should.equal('bleh'));
    });
  });

  context('when mapping', () => {
    it('should resolve when all applied promises are resolved', () => {
      let globalPromise = operations.map([1, 2, 3], x => Promise.resolve(x));

      return globalPromise.then(result => {
        result.should.deep.equal([1, 2, 3]);
      });
    });

    it('should run promises with regards of concurrency', () => {
      let maxConcurrentRuns = 0;
      let concurrentRuns = 0;
      let func = () => operations.try(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      }).then(() => concurrentRuns--);
      let functions = new Array(50).fill().map(() => func);

      let globalPromise = operations.map(functions, f => f(), {concurrency: 4});

      return globalPromise.then(() => {
        maxConcurrentRuns.should.equal(4);
      });
    });
  });

  context('when mapping in series', () => {
    it('should run promises sequentially', () => {
      let runs = [];
      let functions = [
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

      let globalPromise = operations.mapSeries(functions, f => f());

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

  context('when flowing', () => {
    it('should create a promise function of all functions', () => {
      let runs = [];
      let functions = [
        () => operations.delay(1).then(() => {
          runs.push('1');
        }),
        () => operations.delay(1).then(() => {
          runs.push('2');
        })
      ];

      let globalPromise = operations.flow(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should preserve order', () => {
      let runs = [];
      let functions = [
        () => operations.delay(20).then(() => {
          runs.push('1');
        }),
        () => operations.delay(1).then(() => {
          runs.push('2');
        })
      ];

      let globalPromise = operations.flow(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should supply return value of the previous function to the next', () => {
      let functions = [
        result => operations.delay(1).then(() => [...result, '1']),
        result => operations.delay(1).then(() => [...result, '2']),
        result => operations.delay(1).then(() => [...result, '3'])
      ];

      let globalPromise = operations.flow(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });

    it('should handle sync and async functions', () => {
      let functions = [
        result => [...result, '1'],
        result => [...result, '2'],
        result => operations.delay(1).then(() => [...result, '3'])
      ];

      let globalPromise = operations.flow(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });
  });
});
