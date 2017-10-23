'use strict';

const {delay, wrap} = require('../operations');
const createQueue = require('./queue');

describe('A queue', () => {

  let queue;

  beforeEach(() => {
    queue = createQueue();
  });

  it('should run action if empty', () => {
    const action = () => Promise.resolve('run');

    return queue.enqueue(action).then(result => {
      result.should.equal('run');
    });
  });

  it('should run queued actions sequentially', () => {
    const runs = [];

    const promises = [
      queue.enqueue(delay(10, () => runs.push('1'))),
      queue.enqueue(delay(5, () => runs.push('2'))),
      queue.enqueue(delay(0, () => runs.push('3')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['1', '2', '3']);
    });
  });

  it('should accept another action though previous one has failed', () => {
    const runs = [];
    const queue = createQueue({capacity: 2});

    const promises = [
      queue.enqueue(() => Promise.reject('failure')).catch(() => runs.push('failing action')),
      queue.enqueue(wrap(() => runs.push('second action')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.include('failing action');
      runs.should.include('second action');
    });
  });

  it('could be configured to run multiple actions concurrently', () => {
    const runs = [];
    const queue = createQueue({concurrency: 2});

    const promises = [
      queue.enqueue(delay(20, () => runs.push('1'))),
      queue.enqueue(delay(5, () => runs.push('2'))),
      queue.enqueue(delay(10, () => runs.push('3'))),
      queue.enqueue(delay(8, () => runs.push('4')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['2', '3', '1', '4']);
    });
  });

  it('could be configured to run callback when running count is updated', () => {
    const updates = [];
    const queue = createQueue({
      concurrency: 2,
      onRunningUpdated: value => {
        updates.push(value);
      }
    });

    const promises = [
      queue.enqueue(delay(0, () => undefined)),
      queue.enqueue(delay(50, () => undefined)),
      queue.enqueue(delay(100, () => undefined))
    ];

    return Promise.all(promises).then(() => {
      updates.should.deep.equal([1, 2, 1, 2, 1, 0]);
    });
  });

  it('could be configured to run callback when count is updated', () => {
    const updates = [];
    const queue = createQueue({
      onCountUpdated: value => {
        updates.push(value);
      }
    });

    const promises = [
      queue.enqueue(delay(0, () => undefined)),
      queue.enqueue(delay(50, () => undefined)),
      queue.enqueue(delay(100, () => undefined))
    ];

    return Promise.all(promises).then(() => {
      updates.should.deep.equal([1, 2, 3, 2, 1, 0]);
    });
  });
});
