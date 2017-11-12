'use strict';

const { timeout } = require('../lib');

timeout(300, resolveAfter)(5000)
  .then(() => console.log('Will not be called'))
  .catch(console.error);

function resolveAfter(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
