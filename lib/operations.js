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
  return new Promise((resolve, reject) => {
    const results = [];
    let index = 0;
    for (let i = 0; i < opts.concurrency; i++) {
      runNext();
    }

    function runNext() {
      if (index === values.length) {
        resolve(results);
      }
      else {
        asyncTry(() => func(values[index]))
          .then(result => {
            results.push(result);
            runNext();
          })
          .catch(reject);
        index++;
      }
    }
  });

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
