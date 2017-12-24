import { timeout } from './timeout';

describe('Timeout', () => {
  describe('creates a function that', () => {
    it('should reject when function takes to much time', () => {
      const slowFunction = () => new Promise(() => undefined);
      const withTimeout = timeout(10, slowFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('Timeout expired (10ms)')
      );
    });

    it('should resolve when function is quick enough', () => {
      const quickFunction = () =>
        new Promise(resolve => setTimeout(() => resolve('ok'), 10));
      const withTimeout = timeout(100, quickFunction);

      const promise = withTimeout();

      return promise.then(result => {
        expect(result).toEqual('ok');
      });
    });

    it('should forward promise rejection', () => {
      const failingFunction = () =>
        new Promise((resolve, reject) =>
          setTimeout(() => reject(new Error('Failure sorry')), 10)
        );
      const withTimeout = timeout(100, failingFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('Failure sorry')
      );
    });
  });

  it('should pass all arguments to the created function', () => {
    const func = (...args) =>
      new Promise(resolve => setTimeout(() => resolve([...args]), 10));
    const withTimeout = timeout(100, func);

    const promise = withTimeout('hello', 'world');

    return promise.then(args => {
      expect(args).toEqual(['hello', 'world']);
    });
  });
});
