'use strict';

const asyncTry = require('./try');

function compose(functions = []) {
  return result => new Promise((resolve, reject) => {
    let doneCount = 0;
    runNext(result);

    function runNext(currentResult) {
      if (doneCount === functions.length) {
        resolve(currentResult);
      } else {
        asyncTry(() => functions[doneCount](currentResult))
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
