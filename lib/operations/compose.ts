import { AnyFunction, PromiseFunction } from '../types';
import { wrap } from './wrap';

export function compose(functions: AnyFunction[] = []): PromiseFunction<any> {
  if (functions.length === 0) {
    return x => Promise.resolve(x);
  }
  if (functions.length === 1) {
    return wrap(functions[0]);
  }
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      let doneCount = 0;
      runNext(...args);

      function runNext(...runNextArgs: any[]) {
        if (doneCount === functions.length) {
          const [result] = runNextArgs;
          resolve(result);
        } else {
          wrap(functions[doneCount])(...runNextArgs)
            .then(updatedResult => {
              doneCount++;
              runNext(updatedResult);
            })
            .catch(error => {
              reject(error);
            });
        }
      }
    });
}
