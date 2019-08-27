import { retryWithOptions } from './retry';

describe('Retry with options', () => {
  it('should call function and return result if everything is ok', async () => {
    const func = () => Promise.resolve('ok');

    const result = await retryWithOptions({}, func)();

    expect(result).toEqual('ok');
  });

  it('should forward provided arguments', async () => {
    const func = (message: string) => Promise.resolve(message);

    const result = await retryWithOptions({}, func)('ok');

    expect(result).toEqual('ok');
  });

  it('could call non-promise function', async () => {
    const func = () => 'ok';

    const result = await retryWithOptions({}, func)();

    expect(result).toEqual('ok');
  });

  it('should retry the provided times and return last error if no success', () => {
    let calls = 0;
    const func = () => {
      calls++;
      return Promise.reject(new Error('oh no :('));
    };

    const retrying = retryWithOptions({ retryCount: 2 }, func)();

    return retrying.then(
      () => Promise.reject(new Error('should have failed')),
      (error: Error) => {
        expect(error).toEqual(new Error('oh no :('));
        expect(calls).toEqual(3);
      }
    );
  });

  it('should call on try error callback for each errors', () => {
    const errors: Error[] = [];
    const onTryError = (error: Error) => {
      errors.push(error);
    };
    let count = 0;
    const func = () => {
      count++;
      return Promise.reject(new Error(`oh no :( ${count}`));
    };

    const retrying = retryWithOptions({ retryCount: 2, onTryError }, func)();

    return retrying.then(
      () => Promise.reject(new Error('should have failed')),
      () => {
        expect(errors).toEqual([
          new Error('oh no :( 1'),
          new Error('oh no :( 2')
        ]);
      }
    );
  });

  it('should call on final error callback with last error', () => {
    let finalError: Error | null = null;
    const onFinalError = (error: Error) => {
      finalError = error;
    };
    let count = 0;
    const func = () => {
      count++;
      return Promise.reject(new Error(`oh no :( ${count}`));
    };

    const retrying = retryWithOptions({ retryCount: 2, onFinalError }, func)();

    return retrying.then(
      () => Promise.reject(new Error('should have failed')),
      () => {
        expect(finalError).toEqual(new Error('oh no :( 3'));
      }
    );
  });

  it('should retry and eventually succeed', async () => {
    let calls = 0;
    const func = () => {
      calls++;
      if (calls > 1) {
        return Promise.resolve('ok');
      }
      return Promise.reject(new Error('oh no :('));
    };

    await retryWithOptions({ retryCount: 10 }, func)();

    expect(calls).toEqual(2);
  });

  it('should forward arguments each try and eventually succeed', async () => {
    let calls = 0;
    const func = (message: string) => {
      calls++;
      if (calls > 1) {
        return Promise.resolve(message);
      }
      return Promise.reject(new Error('oh no :('));
    };

    const result = await retryWithOptions({ retryCount: 10 }, func)('ok');

    expect(result).toEqual('ok');
  });
});
