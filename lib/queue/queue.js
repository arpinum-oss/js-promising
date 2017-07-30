'use strict';

class Queue {

  constructor(options) {
    this._options = Object.assign({}, {capacity: Number.MAX_SAFE_INTEGER}, options);
    this._resolvers = [];
  }

  enqueue(action) {
    const self = this;

    if (capacityReached()) {
      return Promise.resolve();
    }

    const {resolve, promise} = createDeferred();
    this._resolvers.push(resolve);

    ifAloneDequeueNext();

    return promise
      .then(() => action())
      .then(result => {
        runComplete();
        return result;
      })
      .catch(rejection => {
        runComplete();
        throw rejection;
      });

    function capacityReached() {
      return self._resolvers.length >= self._options.capacity;
    }

    function createDeferred() {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });
      return {promise, resolve};
    }

    function ifAloneDequeueNext() {
      if (aloneInQueue()) {
        dequeueNext();
      }
    }

    function aloneInQueue() {
      return self._resolvers.length === 1;
    }

    function runComplete() {
      self._resolvers.shift();
      dequeueNext();
    }

    function dequeueNext() {
      if (self._resolvers.length > 0) {
        self._resolvers[0]();
      } else {
        triggerEmpty();
      }
    }

    function triggerEmpty() {
      if (self._options.onEmpty) {
        self._options.onEmpty();
      }
    }
  }
}

module.exports = Queue;
