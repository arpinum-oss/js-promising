import { autoCurry } from "../functions";
import { AnyFunction, PromisifiedFunction } from "../types";
import { wrap } from "./wrap";

interface Options {
  count?: number;
  endlessly?: boolean;
  onTryError?: (error: Error) => any;
  onFinalError?: (error: Error) => any;
  shouldRetry?: (error: Error) => boolean | Promise<boolean>;
}

export function rawRetryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F,
): PromisifiedFunction<F> {
  const {
    count = 3,
    endlessly = false,
    onTryError = () => undefined,
    onFinalError = () => undefined,
    shouldRetry = () => true,
  } = options;
  const wrappedOnTryError = wrap(onTryError);
  const wrappedOnFinalError = wrap(onFinalError);
  const wrappedshouldRetry = wrap(shouldRetry);
  const wrappedFunc = wrap(func);
  return doRawRetryWithOptions(
    {
      count,
      endlessly,
      onTryError: wrappedOnTryError,
      onFinalError: wrappedOnFinalError,
      shouldRetry: wrappedshouldRetry,
    },
    wrappedFunc,
  );
}

interface ResolvedOptions {
  count: number;
  endlessly: boolean;
  onTryError: (error: Error) => Promise<any>;
  onFinalError: (error: Error) => Promise<any>;
  shouldRetry: (error: Error) => Promise<boolean>;
}

function doRawRetryWithOptions<F extends AnyFunction>(
  options: Required<ResolvedOptions>,
  func: F,
): PromisifiedFunction<F> {
  const { count, endlessly, onTryError, onFinalError, shouldRetry } = options;
  return (...args: Parameters<F>) =>
    func(...args).catch((error: Error) => {
      const nextCount = endlessly ? count : count - 1;
      return canRetry(error, nextCount).then((retryPossible) => {
        if (!retryPossible) {
          return onFinalError(error).then(() => Promise.reject(error));
        }
        return onTryError(error).then(() =>
          doRawRetryWithOptions(
            {
              count: nextCount,
              endlessly,
              onTryError,
              onFinalError,
              shouldRetry,
            },
            func,
          )(...args),
        );
      });
    });

  function canRetry(error: Error, nextCount: number): Promise<boolean> {
    return shouldRetry(error).then((condition: boolean) => {
      return condition && nextCount >= 0;
    });
  }
}

const curriedRetryWithOptions = autoCurry(rawRetryWithOptions);

export function retryWithOptions<F extends AnyFunction>(
  options: Options,
  func: F,
): PromisifiedFunction<F>;
export function retryWithOptions(
  options: Options,
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function retryWithOptions<F extends AnyFunction>(
  ...args: any[]
): PromisifiedFunction<F> | ((func: F) => PromisifiedFunction<F>) {
  return curriedRetryWithOptions(...args);
}

function rawRetry<F extends AnyFunction>(
  count: number,
  func: F,
): PromisifiedFunction<F> {
  return rawRetryWithOptions({ count }, func);
}

const curriedRetry = autoCurry(rawRetry);

export function retry<F extends AnyFunction>(
  count: number,
  func: F,
): PromisifiedFunction<F>;
export function retry(
  count: number,
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function retry<F extends AnyFunction>(
  ...args: any[]
): PromisifiedFunction<F> | ((func: F) => PromisifiedFunction<F>) {
  return curriedRetry(...args);
}
