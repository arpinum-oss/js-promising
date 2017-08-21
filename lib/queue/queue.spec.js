'use strict';

const {wrap} = require('../operations');
const createQueue = require('./queue');

describe('The queue', () => {

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
      queue.enqueue(asyncAction(() => runs.push('1'))),
      queue.enqueue(asyncAction(() => runs.push('2'))),
      queue.enqueue(asyncAction(() => runs.push('3'))),
      queue.enqueue(asyncAction(() => runs.push('4'))),
      queue.enqueue(asyncAction(() => runs.push('5')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['1', '2', '3', '4', '5']);
    });
  });

  it('should limit queued actions', () => {
    const runs = [];
    const queue = createQueue({capacity: 3});

    const promises = [
      queue.enqueue(asyncAction(() => runs.push('1'))),
      queue.enqueue(asyncAction(() => runs.push('2'))),
      queue.enqueue(asyncAction(() => runs.push('3'))),
      queue.enqueue(asyncAction(() => runs.push('4'))),
      queue.enqueue(asyncAction(() => runs.push('5')))
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
      queue.enqueue(asyncAction(() => runs.push('second action')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.include('failing action');
      runs.should.include('second action');
    });
  });

  function asyncAction(action) {
    return wrap(action);
  }

  it('should call on empty callback when queue become empty', (done) => {
    const queue = createQueue({
      onEmpty: () => {
        done();
      }
    });

    queue.enqueue(() => undefined);
  });
});
