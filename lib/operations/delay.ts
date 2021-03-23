import { autoCurry } from "../functions";
import {
  AnyFunction,
  PromisifiedFunction,
  PromisifiedReturnType,
} from "../types";

function rawDelay<F extends AnyFunction>(
  milliseconds: number,
  func: F
): PromisifiedFunction<F> {
  return (...args: Parameters<F>) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)).then(() =>
      func(...args)
    ) as PromisifiedReturnType<F>;
}

const curriedDelay = autoCurry(rawDelay);

export function delay<F extends AnyFunction>(
  milliseconds: number,
  func: F
): PromisifiedFunction<F>;
export function delay<F extends AnyFunction>(
  milliseconds: number
): (func: F) => PromisifiedFunction<F>;
export function delay<F extends AnyFunction>(
  ...args: any[]
): PromisifiedFunction<F> | ((func: F) => PromisifiedFunction<F>) {
  return curriedDelay(...args);
}
