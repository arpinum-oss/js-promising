import { AnyFunction, PromisifiedFunction } from '../types';
import { wrap } from './wrap';

interface Options {
  retryCount?: number;
  onTryError?: AnyFunction;
  onFinalError?: AnyFunction;
}

export function retryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F
): PromisifiedFunction<F> {
  const {
    retryCount = 3,
    onTryError = () => undefined,
    onFinalError = () => undefined
  } = options;
  const wrappedFunc = wrap(func);
  return doRetryWithOptions(
    { retryCount, onTryError, onFinalError },
    wrappedFunc
  );
}

function doRetryWithOptions<F extends AnyFunction>(
  options: Required<Options>,
  func: F
): PromisifiedFunction<F> {
  const { retryCount, onTryError, onFinalError } = options;
  return (...args: Parameters<F>) => {
    return func(...args).catch((error: Error) => {
      const nextRetryCount = retryCount - 1;
      if (nextRetryCount < 0) {
        onFinalError(error);
        throw error;
      }
      onTryError(error);
      return doRetryWithOptions(
        {
          retryCount: nextRetryCount,
          onTryError,
          onFinalError
        },
        func
      )(...args);
    });
  };
}
