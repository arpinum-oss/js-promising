'use strict';

function wrapToPromise(func) {
  return new Promise((resolve, reject) => {
    try {
      const result = func();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = wrapToPromise;
