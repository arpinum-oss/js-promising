'use strict';

const { map, mapSeries, mapWithOptions } = require('../build');

const count = 100000;

run();
// Map (concurrency: 3): 100000 promises handled in 384 ms
// Map (concurrency: 1): 100000 promises handled in 378 ms
// Map series: 100000 promises handled in 339 ms

async function run() {
  await benchmark(
    () => map(f => f(), createPromiseFuncs()),
    'Map (concurrency: 3)'
  );
  await benchmark(
    () => mapWithOptions(f => f(), { concurrency: 1 }, createPromiseFuncs()),
    'Map (concurrency: 1)'
  );
  await benchmark(
    () => mapSeries(f => f(), createPromiseFuncs()),
    'Map series'
  );
}

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
