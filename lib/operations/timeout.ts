import { AnyFunction, PromiseFunction } from '../types';

interface Options {
  createError?: (delay: number) => Error;
}

export function timeout(
  delay: number,
  options: Options,
  func: AnyFunction
): PromiseFunction<any> {
  return (...args: any[]) => {
    const opts = Object.assign({}, { createError }, options);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(opts.createError(delay));
      }, delay);
      return func(...args)
        .then((result: any) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((rejection: Error) => {
          clearTimeout(timer);
          reject(rejection);
        });
    });
  };
}

function createError(delay: number) {
  return new Error(`Timeout expired (${delay}ms)`);
}
