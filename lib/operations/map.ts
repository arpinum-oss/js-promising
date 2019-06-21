import { wrap } from './wrap';

interface Options {
  concurrency?: number;
}

export function map<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  options: Options,
  values: T1[]
): Promise<T2[]> {
  const opts = Object.assign({}, { concurrency: 3 }, options);
  if (values.length === 0) {
    return Promise.resolve([]);
  }
  if (values.length === 1) {
    return wrap(func)(values[0]).then(r => [r]);
  }
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let index = 0;
    let doneCount = 0;
    let firstRejection: Error;
    for (let i = 0; i < opts.concurrency; i++) {
      runNext();
    }

    function runNext() {
      if (index !== values.length) {
        const resultIndex = index;
        wrap(func)(values[index])
          .then(result => {
            handleSuccess(result, resultIndex);
          })
          .catch(error => {
            handleError(error);
          });
        index++;
      }
    }

    function handleSuccess(result: T2, resultIndex: number) {
      results[resultIndex] = result;
      handleDone();
    }

    function handleError(error: Error) {
      firstRejection = firstRejection || error;
      handleDone();
    }

    function handleDone() {
      doneCount++;
      if (doneCount === values.length) {
        if (firstRejection) {
          reject(firstRejection);
        } else {
          resolve(results);
        }
      } else {
        runNext();
      }
    }
  });
}
