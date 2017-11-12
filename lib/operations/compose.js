'use strict';

const wrap = require('./wrap');

function compose(functions = []) {
  return (...args) =>
    new Promise((resolve, reject) => {
      let doneCount = 0;
      runNext(...args);

      function runNext(...args) {
        if (doneCount === functions.length) {
          const [result] = args;
          resolve(result);
        } else {
          wrap(functions[doneCount])(...args)
            .then(updatedResult => {
              doneCount++;
              runNext(updatedResult);
            })
            .catch(error => {
              reject(error);
            });
        }
      }
    });
}

module.exports = compose;
