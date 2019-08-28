import { autoCurry } from '../functions';
import { AnyFunction, PromisifiedFunction } from '../types';
import { wrap } from './wrap';

interface Options {
  count?: number;
  onTryError?: AnyFunction;
  onFinalError?: AnyFunction;
}

export function rawRetryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F
): PromisifiedFunction<F> {
  const {
    count = 3,
    onTryError = () => undefined,
    onFinalError = () => undefined
  } = options;
  const wrappedOnTryError = wrap(onTryError);
  const wrappedOnFinalError = wrap(onFinalError);
  const wrappedFunc = wrap(func);
  return doRawRetryWithOptions(
    {
      count,
      onTryError: wrappedOnTryError,
      onFinalError: wrappedOnFinalError
    },
    wrappedFunc
  );
}

function doRawRetryWithOptions<F extends AnyFunction>(
  options: Required<Options>,
  func: F
): PromisifiedFunction<F> {
  const { count, onTryError, onFinalError } = options;
  return (...args: Parameters<F>) =>
    func(...args).catch((error: Error) => {
      const nextCount = count - 1;
      if (nextCount < 0) {
        return onFinalError(error).then(() => Promise.reject(error));
      }
      return onTryError(error).then(() =>
        doRawRetryWithOptions(
          {
            count: nextCount,
            onTryError,
            onFinalError
          },
          func
        )(...args)
      );
    });
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
  count: number,
  func: F
): PromisifiedFunction<F> {
  return rawRetryWithOptions({ count }, func);
}

const curriedRetry = autoCurry(rawRetry);

export function retry<F extends AnyFunction>(
  count: number,
  func: F
): PromisifiedFunction<F>;
export function retry(
  count: number
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function retry(...args: any[]) {
  return curriedRetry(...args);
}
