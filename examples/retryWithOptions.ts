// tslint:disable: no-console
import { retryWithOptions } from '../lib';

let hasFailed = false;

const addWithRetry = retryWithOptions(
  { retryCount: 5, onTryError: e => console.error(e.message) },
  brokenAdd
);

addWithRetry(1, 7).then(result => console.log(result)); // 8

function brokenAdd(a: number, b: number) {
  if (hasFailed) {
    return Promise.resolve(a + b);
  }
  hasFailed = true;
  return Promise.reject(new Error('An error occurred'));
}
