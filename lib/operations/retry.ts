import { autoCurry } from '../functions';
import { AnyFunction, PromisifiedFunction } from '../types';
import { wrap } from './wrap';

interface Options {
  retryCount?: number;
  onTryError?: AnyFunction;
  onFinalError?: AnyFunction;
}

export function rawRetryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F
): PromisifiedFunction<F> {
  const {
    retryCount = 3,
    onTryError = () => undefined,
    onFinalError = () => undefined
  } = options;
  const wrappedFunc = wrap(func);
  return doRawRetryWithOptions(
    { retryCount, onTryError, onFinalError },
    wrappedFunc
  );
}

function doRawRetryWithOptions<F extends AnyFunction>(
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
      return doRawRetryWithOptions(
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

const curriedRetryWithOptions = autoCurry(rawRetryWithOptions);

export function retryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F
): PromisifiedFunction<F>;
export function retryWithOptions(
  options: Options
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function retryWithOptions(...args: any[]) {
  return curriedRetryWithOptions(...args);
}

function rawRetry<F extends AnyFunction>(
  retryCount: number,
  func: F
): PromisifiedFunction<F> {
  return rawRetryWithOptions({ retryCount }, func);
}

const curriedRetry = autoCurry(rawRetry);

export function retry<F extends AnyFunction>(
  retryCount: number,
  func: F
): PromisifiedFunction<F>;
export function retry(
  retryCount: number
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function retry(...args: any[]) {
  return curriedRetry(...args);
}
