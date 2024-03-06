import { autoCurry } from "../functions";
import { wrap } from "./wrap";

interface Options {
  concurrency?: number;
}
function rawMapWithOptions<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  options: Options,
  values: T1[],
): Promise<T2[]> {
  const opts = Object.assign({}, { concurrency: 3 }, options);
  return doRawMapWithOptions(wrap(func), opts, values);
}

function doRawMapWithOptions<T1, T2>(
  func: (v: T1) => Promise<T2>,
  options: Required<Options>,
  values: T1[],
): Promise<T2[]> {
  if (values.length === 0) {
    return Promise.resolve([]);
  }
  if (values.length === 1) {
    return func(values[0]).then((r) => [r]);
  }
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let index = 0;
    let doneCount = 0;
    let firstRejection: Error;
    for (let i = 0; i < options.concurrency; i++) {
      runNext();
    }

    function runNext() {
      if (index !== values.length) {
        const resultIndex = index;
        func(values[index])
          .then((result) => {
            handleSuccess(result, resultIndex);
          })
          .catch((error) => {
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

const curriedMapWithOptions = autoCurry(rawMapWithOptions);

export function mapWithOptions<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  options: Options,
  values: T1[],
): Promise<T2[]>;
export function mapWithOptions<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
): (options: Options) => (values: T1[]) => Promise<T2[]>;
export function mapWithOptions<T1, T2>(
  ...args: any[]
): Promise<T2[]> | ((options: Options) => (values: T1[]) => Promise<T2[]>) {
  return curriedMapWithOptions(...args);
}

function rawMap<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  values: T1[],
): Promise<T2[]> {
  return rawMapWithOptions(func, {}, values);
}

const curriedMap = autoCurry(rawMap);

export function map<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  values: T1[],
): Promise<T2[]>;
export function map<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
): (values: T1[]) => Promise<T2[]>;
export function map<T1, T2>(
  ...args: any[]
): Promise<T2[]> | ((values: T1[]) => Promise<T2[]>) {
  return curriedMap(...args);
}

function rawMapSeries<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  values: T1[],
): Promise<T2[]> {
  return rawMapWithOptions(func, { concurrency: 1 }, values);
}

const curriedMapSeries = autoCurry(rawMapSeries);

export function mapSeries<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
  values: T1[],
): Promise<T2[]>;
export function mapSeries<T1, T2>(
  func: (v: T1) => T2 | Promise<T2>,
): (values: T1[]) => Promise<T2[]>;
export function mapSeries<T1, T2>(
  ...args: any[]
): Promise<T2[]> | ((values: T1[]) => Promise<T2[]>) {
  return curriedMapSeries(...args);
}
