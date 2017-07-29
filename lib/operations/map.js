'use strict';

const wrap = require('./wrap');

function map(values, func, options) {
  const opts = Object.assign({}, {concurrency: 3}, options);
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let index = 0;
    let doneCount = 0;
    let firstRejection;
    for (let i = 0; i < opts.concurrency; i++) {
      runNext();
    }

    function runNext() {
      if (index !== values.length) {
        const resultIndex = index;
        wrap(() => func(values[index]))
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

module.exports = map;
