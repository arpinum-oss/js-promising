'use strict';

function createQueue(options) {
  const {
    capacity,
    concurrency,
    onRunningUpdated
  } = Object.assign({}, {
    capacity: Number.MAX_SAFE_INTEGER,
    concurrency: 1,
    onRunningUpdated: () => undefined
  }, options);
  let head = null;
  let tail = null;
  let count = 0;
  let running = 0;

  return {enqueue};

  function enqueue(action) {
    if (capacityReached()) {
      return Promise.resolve();
    }
    const {resolve, promise} = createDeferred();
    add(resolve);
    dequeueIfPossible();

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
      return count >= capacity;
    }

    function createDeferred() {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });
      return {promise, resolve};
    }

    function add() {
      if (head) {
        tail.next = {resolve};
        tail = tail.next;
      } else {
        head = {resolve};
        tail = head;
      }
      count++;
    }

    function dequeueIfPossible() {
      if (running < concurrency) {
        dequeue();
      }
    }

    function runComplete() {
      count--;
      updateRunning(running - 1);
      dequeue();
    }

    function dequeue() {
      if (head) {
        updateRunning(running + 1);
        head.resolve();
        head = head.next;
      } else {
        tail = null;
      }
    }

    function updateRunning(value) {
      running = value;
      onRunningUpdated(running);
    }
  }
}

module.exports = createQueue;
