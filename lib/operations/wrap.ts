import { PromiseFunction, PromiseMaybeFunction } from '../types';

export function wrap<T>(func: PromiseMaybeFunction<T>): PromiseFunction<T> {
  return (...args) => {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
}
