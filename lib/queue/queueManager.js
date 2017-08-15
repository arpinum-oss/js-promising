'use strict';

const createQueue = require('./queue');

function createQueueManager() {
  const queues = new Map();
  return {queue};

  function queue(id, options) {
    if (idSeemsBlank(id)) {
      throw new Error('Queue id cannot be blank');
    }
    if (!queues.has(id)) {
      create(id, options);
    }
    return queues.get(id);

    function idSeemsBlank() {
      return id === '' ||
        id === null ||
        id === undefined ||
        id.constructor === Object && Object.keys(id).length === 0;
    }

    function create(id, options) {
      const queueOptions = Object.assign({onEmpty: queueEmpty}, options);
      queues.set(id, createQueue(queueOptions));

      function queueEmpty() {
        queues.delete(id);
      }
    }
  }
}

module.exports = createQueueManager;
