import { delay, wrap } from '../operations';
import { createQueue } from './queue';

describe('A queue', () => {
  let queue;

  beforeEach(() => {
    queue = createQueue();
  });

  it('should run action if empty', () => {
    const action = () => Promise.resolve('run');

    return queue.enqueue(action).then(result => {
      expect(result).toEqual('run');
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
      expect(runs).toEqual(['1', '2', '3']);
    });
  });

  it('should accept another action though previous one has failed', () => {
    const runs = [];
    const myQueue = createQueue({ capacity: 2 });

    const promises = [
      myQueue
        .enqueue(() => Promise.reject('failure'))
        .catch(() => runs.push('failing action')),
      myQueue.enqueue(wrap(() => runs.push('second action')))
    ];

    return Promise.all(promises).then(() => {
      expect(runs).toContain('failing action');
      expect(runs).toContain('second action');
    });
  });

  it('could be configured to run multiple actions concurrently', () => {
    const runs = [];
    const myQueue = createQueue({ concurrency: 2 });

    const promises = [
      myQueue.enqueue(delay(20, () => runs.push('1'))),
      myQueue.enqueue(delay(5, () => runs.push('2'))),
      myQueue.enqueue(delay(10, () => runs.push('3'))),
      myQueue.enqueue(delay(8, () => runs.push('4')))
    ];

    return Promise.all(promises).then(() => {
      expect(runs).toEqual(['2', '3', '1', '4']);
    });
  });

  it('could be configured to run callback when running count is updated', () => {
    const updates = [];
    const myQueue = createQueue({
      concurrency: 2,
      onRunningUpdated: value => {
        updates.push(value);
      }
    });

    const promises = [
      myQueue.enqueue(delay(0, () => undefined)),
      myQueue.enqueue(delay(50, () => undefined)),
      myQueue.enqueue(delay(100, () => undefined))
    ];

    return Promise.all(promises).then(() => {
      expect(updates).toEqual([1, 2, 1, 2, 1, 0]);
    });
  });

  it('could be configured to run callback when count is updated', () => {
    const updates = [];
    const myQueue = createQueue({
      onCountUpdated: value => {
        updates.push(value);
      }
    });

    const promises = [
      myQueue.enqueue(delay(0, () => undefined)),
      myQueue.enqueue(delay(50, () => undefined)),
      myQueue.enqueue(delay(100, () => undefined))
    ];

    return Promise.all(promises).then(() => {
      expect(updates).toEqual([1, 2, 3, 2, 1, 0]);
    });
  });
});
