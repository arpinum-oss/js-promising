import { AnyFunction } from '../types';

export function promisify(func: AnyFunction) {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      func(...args, (error: Error, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}
