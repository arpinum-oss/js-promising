import { AnyFunction } from '../types';

export type ErrorFirstCallback = (error: Error | null, result?: any) => void;

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
