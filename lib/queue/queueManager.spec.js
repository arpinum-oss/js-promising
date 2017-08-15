'use strict';

const {delay} = require('../operations');
const createQueueManager = require('./queueManager');

describe('The queue manager', () => {

  let manager;

  beforeEach(() => {
    manager = createQueueManager();
  });

  it('should return different queues for different id', () => {
    const firstQueue = manager.queue('1');
    const secondQueue = manager.queue('2');

    secondQueue.should.not.equal(firstQueue);
  });

  it('should return the same queue for the same id', () => {
    const firstQueue = manager.queue('1');
    const secondQueue = manager.queue('1');

    firstQueue.should.equal(secondQueue);
  });

  it('should allow id as integer', () => {
    const firstQueue = manager.queue(1);
    const secondQueue = manager.queue(1);
    const thirdQueue = manager.queue(2);

    firstQueue.should.equal(secondQueue);
    firstQueue.should.not.equal(thirdQueue);
  });

  it('should forget queue when empty', () => {
    const queue = manager.queue('1');

    return queue.enqueue(() => delay(10)).then(() => {
      const queueWithSameId = manager.queue('1');
      queueWithSameId.should.not.equal(queue);
    });
  });

  it('should fail if asked queue is blank', () => {
    const call = () => manager.queue({});

    call.should.throw(Error, 'Queue id cannot be blank');
  });
});
