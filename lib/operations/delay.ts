import { AnyFunction, PromiseFunction } from '../types';

export function delay(
  milliseconds: number,
  func: AnyFunction
): PromiseFunction<any> {
  return (...args: any[]) =>
    new Promise(resolve => setTimeout(resolve, milliseconds)).then(() =>
      func(...args)
    );
}
