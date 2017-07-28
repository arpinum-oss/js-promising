'use strict';

function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

function asyncTry(func) {
  return new Promise((resolve, reject) => {
    try {
      const result = func();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function map(values, func, options) {
  const opts = Object.assign({}, {concurrency: 3}, options);
  const resolvers = [];
  let resolverIndex = 0;
  const wrappedRuns = [];
  for (let value of values) {
    const wrappedRun = new Promise(resolve => resolvers.push(resolve))
      .then(() => func(value))
      .then(result => {
        runNextPromise();
        return result;
      });
    wrappedRuns.push(wrappedRun);
  }
  for (let i = 0; i < opts.concurrency; i++) {
    runNextPromise();
  }
  return Promise.all(wrappedRuns);

  function runNextPromise() {
    if (resolverIndex < resolvers.length) {
      resolvers[resolverIndex]();
      resolverIndex++;
    }
  }
}

function mapSeries(values, func) {
  return map(values, func, {concurrency: 1});
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function compose(functions = []) {
  return result => functions.reduce(composing, Promise.resolve(result));

  function composing(acc, func) {
    return acc.then(r => asyncTry(() => func(r)));
  }
}

module.exports = {
  promisify,
  try: asyncTry,
  map,
  mapSeries,
  delay,
  compose
};
