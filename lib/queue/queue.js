'use strict';

class Queue {

  constructor(options) {
    this._options = Object.assign({}, {capacity: Number.MAX_SAFE_INTEGER}, options);
    this._head = null;
    this._tail = null;
    this._count = 0;
  }

  enqueue(action) {
    const self = this;

    if (capacityReached()) {
      return Promise.resolve();
    }

    const {resolve, promise} = createDeferred();

    if (this._count > 0) {
      this._tail.next = {resolve};
      this._tail = this._tail.next;
    } else {
      this._head = {resolve};
      this._tail = this._head;
    }

    this._count++;

    ifAloneDequeue();

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
      return self._count >= self._options.capacity;
    }

    function createDeferred() {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });
      return {promise, resolve};
    }

    function ifAloneDequeue() {
      if (aloneInQueue()) {
        dequeue();
      }
    }

    function aloneInQueue() {
      return self._count === 1;
    }

    function runComplete() {
      self._count--;
      self._head = self._head.next;
      dequeue();
    }

    function dequeue() {
      if (self._count > 0) {
        self._head.resolve();
      } else {
        self._head = null;
        self._tail = null;
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
