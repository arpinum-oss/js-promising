import { delay } from './delay';

describe('Delay', () => {
  it('should resolve after the given ms', () => {
    return delay(1, () => undefined)();
  });

  it('should passe all arguments to the created function', () => {
    const func = (...args: string[]) => args;
    const withDelay = delay(10, func);

    const promise = withDelay('hello', 'world');

    return promise.then(args => {
      expect(args).toEqual(['hello', 'world']);
    });
  });

  describe('creates a function that', () => {
    it('should resolve after the delay', () => {
      const func = () => 'ok';
      const withDelay = delay(10, func);

      const promise = withDelay();

      return promise.then(result => {
        expect(result).toEqual('ok');
      });
    });
  });
});
