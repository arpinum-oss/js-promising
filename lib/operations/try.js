'use strict';

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

module.exports = asyncTry;
