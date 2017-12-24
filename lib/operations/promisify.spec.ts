import { promisify } from './promisify';

describe('Promisify', () => {
  describe('creates a function that', () => {
    it('should resolve the value in callback', () => {
      const func = callback => {
        setTimeout(() => {
          callback(null, 'hello');
        });
      };

      const promisified = promisify(func);

      return promisified().then(result => {
        expect(result).toEqual('hello');
      });
    });

    it('should reject the error in callback', () => {
      const func = callback => {
        setTimeout(() => {
          callback(new Error('bleh'));
        });
      };

      const promisified = promisify(func);

      return promisified().then(
        () => Promise.reject(new Error('Should fail')),
        rejection => expect(rejection.message).toEqual('bleh')
      );
    });
  });

  it('should pass all arguments to the created function', () => {
    const func = (arg1, arg2, callback) => {
      setTimeout(() => {
        callback(null, [arg1, arg2]);
      });
    };

    const promisified = promisify(func);

    return promisified('hello', 'world').then(args => {
      expect(args).toEqual(['hello', 'world']);
    });
  });
});
