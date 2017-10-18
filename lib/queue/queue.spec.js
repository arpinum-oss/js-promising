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
      queue.enqueue(() => delay(10).then(() => runs.push('1'))),
      queue.enqueue(() => delay(5).then(() => runs.push('2'))),
      queue.enqueue(() => delay(0).then(() => runs.push('3')))
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
      queue.enqueue(() => delay(20).then(() => runs.push('1'))),
      queue.enqueue(() => delay(5).then(() => runs.push('2'))),
      queue.enqueue(() => delay(10).then(() => runs.push('3'))),
      queue.enqueue(() => delay(8).then(() => runs.push('4')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['2', '3', '1', '4']);
    });
  });
});
