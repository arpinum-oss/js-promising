'use strict';

const {map} = require('../lib');

const count = 100000;

benchmark(() => map(createPromiseFuncs(), f => f(), {concurrency: 3}), 'Map (concurrency: 3)')
  .then(() => benchmark(() => map(createPromiseFuncs(), f => f(), {concurrency: 1}), 'Map (concurrency: 1)'));

function benchmark(func, context) {
  const start = new Date();
  return func().then(printStatistics);

  function printStatistics() {
    const end = new Date();
    const duration = end - start;
    console.log(`${context}: ${count} promises handled in ${duration} ms`);
  }
}

function createPromiseFuncs() {
  const funcs = [];
  for (let i = 0; i < count; i++) {
    funcs.push(() => Promise.resolve(new Date()));
  }
  return funcs;
}

