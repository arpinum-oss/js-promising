'use strict';

function delay(milliseconds, func) {
  return (...args) =>
    new Promise(resolve => setTimeout(resolve, milliseconds)).then(() =>
      func(...args)
    );
}

module.exports = delay;
