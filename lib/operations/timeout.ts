import { AnyFunction, PromiseFunction } from '../types';

export function timeout(
  delay: number,
  func: AnyFunction
): PromiseFunction<any> {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout expired (${delay}ms)`));
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
