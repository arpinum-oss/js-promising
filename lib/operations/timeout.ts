import { autoCurry } from '../functions';
import { AnyFunction, PromiseFunction } from '../types';

interface Options {
  createError?: (delay: number) => Error;
}

function rawTimeoutWithOptions(
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

const curriedTimeoutWithOptions = autoCurry(rawTimeoutWithOptions);

export function timeoutWithOptions(
  delay: number,
  options: Options,
  func: AnyFunction
): PromiseFunction<any>;
export function timeoutWithOptions(
  delay: number
): (options: Options) => (func: AnyFunction) => PromiseFunction<any>;
export function timeoutWithOptions(...args: []) {
  return curriedTimeoutWithOptions(...args);
}

function rawTimeout(delay: number, func: AnyFunction): PromiseFunction<any> {
  return rawTimeoutWithOptions(delay, {}, func);
}

const curriedTimeout = autoCurry(rawTimeout);

export function timeout(delay: number, func: AnyFunction): PromiseFunction<any>;
export function timeout(
  delay: number
): (func: AnyFunction) => PromiseFunction<any>;
export function timeout(...args: []) {
  return curriedTimeout(...args);
}
