// tslint:disable: no-console
import { readFile } from 'fs';
import { promisify } from 'util';
import { retry } from '../lib';

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retry(2, readFileAsync);

readFileAsyncWithRetry('package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
