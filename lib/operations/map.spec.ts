import { map } from './map';
import { wrap } from './wrap';

describe('Map', () => {
  it('should resolve when all applied promises are resolved', () => {
    const globalPromise = map(x => Promise.resolve(x), null, [1, 2, 3]);

    return globalPromise.then(result => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it('could handle only 1 element', () => {
    const globalPromise = map(x => Promise.resolve(x), null, [1]);

    return globalPromise.then(result => {
      expect(result).toEqual([1]);
    });
  });

  it('should resolve immediatly when no values', () => {
    const globalPromise = map(x => Promise.resolve(x), null, []);

    return globalPromise.then(result => {
      expect(result).toEqual([]);
    });
  });

  it('should return results in same order than values', () => {
    const globalPromise = map(decreasingDelay, null, [1, 2, 3]);

    return globalPromise.then(result => {
      expect(result).toEqual([1, 2, 3]);
    });

    function decreasingDelay(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), 30 / x));
    }
  });

  it('should reject if any promise is rejected', () => {
    const globalPromise = map(rejectFor2, { concurrency: 3 }, [1, 2, 3]);

    return globalPromise.then(
      () => Promise.reject(new Error('Should fail')),
      rejection => expect(rejection.message).toEqual('bleh')
    );

    function rejectFor2(x) {
      return x === 2 ? Promise.reject(new Error('bleh')) : undefined;
    }
  });

  it('should reject with first error', () => {
    const globalPromise = map(rejectForGreaterThan2, { concurrency: 3 }, [
      1,
      2,
      3
    ]);

    return globalPromise.then(
      () => Promise.reject(new Error('Should fail')),
      rejection => expect(rejection.message).toEqual('bleh2')
    );

    function rejectForGreaterThan2(x) {
      return x >= 2 ? Promise.reject(new Error(`bleh${x}`)) : undefined;
    }
  });

  it('should run promises with regards of concurrency', () => {
    let maxConcurrentRuns = 0;
    let concurrentRuns = 0;
    const func = () =>
      wrap(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      })().then(() => concurrentRuns--);

    const functions = new Array(50).fill(func).map(f => f);

    const globalPromise = map(f => f(), { concurrency: 4 }, functions);

    return globalPromise.then(() => {
      expect(maxConcurrentRuns).toEqual(4);
    });
  });

  it('should handle less values than concurrency setting', () => {
    const globalPromise = map(x => Promise.resolve(x), { concurrency: 100 }, [
      1
    ]);

    return globalPromise.then(result => {
      expect(result).toEqual([1]);
    });
  });
});
