'use strict';

function createQueue(options) {
  let _options = Object.assign({}, {capacity: Number.MAX_SAFE_INTEGER}, options);
  let head = null;
  let tail = null;
  let count = 0;

  return {enqueue};

  function enqueue(action) {
    if (capacityReached()) {
      return Promise.resolve();
    }

    const {resolve, promise} = createDeferred();

    if (count > 0) {
      tail.next = {resolve};
      tail = tail.next;
    } else {
      head = {resolve};
      tail = head;
    }

    count++;

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
      return count >= _options.capacity;
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
      return count === 1;
    }

    function runComplete() {
      count--;
      head = head.next;
      dequeue();
    }

    function dequeue() {
      if (count > 0) {
        head.resolve();
      } else {
        head = null;
        tail = null;
        triggerEmpty();
      }
    }

    function triggerEmpty() {
      if (_options.onEmpty) {
        _options.onEmpty();
      }
    }
  }
}

module.exports = createQueue;
