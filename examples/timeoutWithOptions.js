'use strict';

const { timeoutWithOptions } = require('../build');

timeoutWithOptions(300, { createError }, resolveAfter)(5000)
  .then(() => console.log('Will not be called'))
  .catch(console.error);

function createError(delay) {
  return new Error(`Too slow (>${delay}ms)`);
}

function resolveAfter(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
