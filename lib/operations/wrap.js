'use strict';

function wrap(func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = wrap;
