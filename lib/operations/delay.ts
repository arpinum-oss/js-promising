import { autoCurry } from '../functions';
import { AnyFunction, PromiseFunction } from '../types';

function rawDelay(
  milliseconds: number,
  func: AnyFunction
): PromiseFunction<any> {
  return (...args: any[]) =>
    new Promise(resolve => setTimeout(resolve, milliseconds)).then(() =>
      func(...args)
    );
}

const curriedDelay = autoCurry(rawDelay);

export function delay(
  milliseconds: number,
  func: AnyFunction
): PromiseFunction<any>;
export function delay(
  milliseconds: number
): (func: AnyFunction) => PromiseFunction<any>;
export function delay(...args: any[]) {
  return curriedDelay(...args);
}
