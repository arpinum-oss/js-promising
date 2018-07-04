import { wrap } from './wrap';

describe('Wrap', () => {
  describe('creates a function that', () => {
    it('should resolve the immediate value', () => {
      const func = () => 'hello';

      const promise = wrap(func)();

      return promise.then(result => {
        expect(result).toEqual('hello');
      });
    });

    it('should reject an error', () => {
      const func = () => {
        throw new Error('bleh');
      };

      const promise = wrap(func)();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('bleh')
      );
    });

    it('should resolve a resolved value', () => {
      const func = () =>
        new Promise(resolve => setTimeout(() => resolve('hello')));

      const promise = wrap(func)();

      return promise.then(result => {
        expect(result).toEqual('hello');
      });
    });

    it('should reject a rejection', () => {
      const func = () =>
        new Promise((_, reject) => setTimeout(() => reject(new Error('bleh'))));

      const promise = wrap(func)();

      return promise.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('bleh')
      );
    });
  });

  it('should pass all arguments to the created function', () => {
    const func = (...args: number[]) => args;

    const promise = wrap(func)(1, 2, 3);

    return promise.then(result => {
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
