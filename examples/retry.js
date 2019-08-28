'use strict';

const { readFile } = require('fs');
const { promisify } = require('util');
const { retry } = require('../build');

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retry(2, readFileAsync);

readFileAsyncWithRetry('package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
