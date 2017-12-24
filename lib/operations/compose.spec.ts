import { compose } from './compose';
import { delay } from './delay';

describe('Compose', () => {
  it('should create a promise function of all functions', () => {
    const runs = [];
    const functions = [
      delay(1, () => runs.push('1')),
      delay(2, () => runs.push('2'))
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(['1', '2']);
    });
  });

  it('should preserve order', () => {
    const runs = [];
    const functions = [
      delay(10, () => runs.push('1')),
      delay(1, () => runs.push('2'))
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(['1', '2']);
    });
  });

  it('should supply return value of the previous function to the next', () => {
    const functions = [
      delay(1, result => [...result, '1']),
      delay(1, result => [...result, '2']),
      delay(1, result => [...result, '3'])
    ];

    const globalPromise = compose(functions)(['initial']);

    return globalPromise.then(result => {
      expect(result).toEqual(['initial', '1', '2', '3']);
    });
  });

  it('should handle sync and async functions', () => {
    const functions = [
      result => [...result, '1'],
      result => [...result, '2'],
      delay(1, result => [...result, '3'])
    ];

    const globalPromise = compose(functions)(['initial']);

    return globalPromise.then(result => {
      expect(result).toEqual(['initial', '1', '2', '3']);
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
      rejection => expect(rejection.message).toEqual('bleh')
    );
  });

  it('should first function to have any number of arguments', () => {
    const add = (x, y) => Promise.resolve(x + y);
    const square = x => Promise.resolve(x * x);
    const addSquare = compose([add, square]);

    return addSquare(1, 2).then(result => {
      expect(result).toEqual(9);
    });
  });
});