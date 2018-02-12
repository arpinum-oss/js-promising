import { wrap } from './wrap';

export function map<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  options: {
    concurrency: number;
  },
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
            handleDone(null, result, resultIndex);
          })
          .catch(error => {
            handleDone(error, null, null);
          });
        index++;
      }
    }

    function handleDone(error: Error, result: T2, resultIndex: number) {
      doneCount++;
      if (error) {
        firstRejection = firstRejection || error;
      } else {
        results[resultIndex] = result;
      }
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
