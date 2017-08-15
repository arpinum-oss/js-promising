'use strict';

const wrap = require('./wrap');

function compose(functions = []) {
  return result => new Promise((resolve, reject) => {
    let doneCount = 0;
    runNext(result);

    function runNext(currentResult) {
      if (doneCount === functions.length) {
        resolve(currentResult);
      } else {
        wrap(() => functions[doneCount](currentResult))
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