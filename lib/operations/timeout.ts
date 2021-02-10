import { autoCurry } from "../functions";
import {
  AnyFunction,
  PromisifiedFunction,
  PromisifiedReturnType,
} from "../types";
import { wrap } from "./wrap";

interface Options {
  createError?: (delay: number) => Error;
}

function rawTimeoutWithOptions<F extends AnyFunction>(
  delay: number,
  options: Options,
  func: F
): PromisifiedFunction<F> {
  return (...args: Parameters<F>) => {
    const opts = Object.assign({}, { createError }, options);
    return new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => {
        if (!done) {
          reject(opts.createError(delay));
        }
      }, delay);
      const wrappedFunc = wrap(func);
      return wrappedFunc(...args)
        .then((result: any) => {
          done = true;
          clearTimeout(timer);
          resolve(result);
        })
        .catch((rejection: Error) => {
          done = true;
          clearTimeout(timer);
          reject(rejection);
        });
    }) as PromisifiedReturnType<F>;
  };
}

function createError(delay: number) {
  return new Error(`Timeout expired (${delay}ms)`);
}

const curriedTimeoutWithOptions = autoCurry(rawTimeoutWithOptions);

export function timeoutWithOptions<F extends AnyFunction>(
  delay: number,
  options: Options,
  func: F
): PromisifiedFunction<F>;
export function timeoutWithOptions(
  delay: number
): (
  options: Options
) => <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function timeoutWithOptions(...args: []) {
  return curriedTimeoutWithOptions(...args);
}

function rawTimeout<F extends AnyFunction>(
  delay: number,
  func: F
): PromisifiedFunction<F> {
  return rawTimeoutWithOptions(delay, {}, func);
}

const curriedTimeout = autoCurry(rawTimeout);

export function timeout<F extends AnyFunction>(
  delay: number,
  func: F
): PromisifiedFunction<F>;
export function timeout(
  delay: number
): <F extends AnyFunction>(func: F) => PromisifiedFunction<F>;
export function timeout(...args: []) {
  return curriedTimeout(...args);
}
