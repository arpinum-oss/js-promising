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
    let doneCount = 0;
    let firstRejection;
    for (let i = 0; i < opts.concurrency; i++) {
      runNext();
    }

    function runNext() {
      if (index !== values.length) {
        const resultIndex = index;
        asyncTry(() => func(values[index]))
          .then(result => {
            handleDone(null, result, resultIndex);
          })
          .catch(error => {
            handleDone(error);
          });
        index++;
      }
    }

    function handleDone(error, result, resultIndex) {
      doneCount++;
      if (error) {
        firstRejection = firstRejection || error;
        results[resultIndex] = null;
      } else {
        results[resultIndex] = result;
      }
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
