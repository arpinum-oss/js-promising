import {
  AnyFunction,
  PromisifiedFunction,
  PromisifiedReturnType,
} from "../types";

export function wrap<F extends AnyFunction>(func: F): PromisifiedFunction<F> {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }) as PromisifiedReturnType<F>;
  };
}
