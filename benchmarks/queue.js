'use strict';

const { createQueue } = require('../build');

const count = 100000;

const queue = createQueue();

const start = new Date();
return enqueueAll().then(printStatistics);
// 100000 functions enqueued in 798 ms

function enqueueAll() {
  for (let i = 0; i < count - 1; i++) {
    enqueue();
  }
  return enqueue();

  function enqueue() {
    return queue.enqueue(() => new Date());
  }
}

function printStatistics() {
  const end = new Date();
  const duration = end - start;
  console.log(`${count} functions enqueued in ${duration} ms`);
}
