'use strict';

function timeout(delay, func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout expired (${delay}ms)`));
      }, delay);
      return func(...args)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(rejection => {
          clearTimeout(timer);
          reject(rejection);
        });
    });
  };
}

module.exports = timeout;
