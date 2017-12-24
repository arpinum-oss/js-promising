import { AnyFunction } from '../types';

export interface QueueOptions {
  capacity?: number;
  concurrency?: number;
  onRunningUpdated?: (count: number) => void;
  onCountUpdated?: (count: number) => void;
}

interface QueueItem {
  next?: QueueItem;
  resolve: () => void;
}

export function createQueue(options?: QueueOptions) {
  const {
    capacity,
    concurrency,
    onRunningUpdated,
    onCountUpdated
  } = Object.assign(
    {},
    {
      capacity: Number.MAX_SAFE_INTEGER,
      concurrency: 1,
      onRunningUpdated: () => undefined,
      onCountUpdated: () => undefined
    },
    options
  );
  let head: QueueItem = null;
  let tail: QueueItem = null;
  let count = 0;
  let running = 0;

  return { enqueue };

  function enqueue(action: AnyFunction) {
    if (capacityReached()) {
      return Promise.resolve();
    }
    const { resolve, promise } = createDeferred();
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

    function add(newResolve: () => void) {
      if (head) {
        tail.next = { resolve: newResolve };
        tail = tail.next;
      } else {
        head = { resolve };
        tail = head;
      }
      updateCount(count + 1);
    }

    function dequeueIfPossible() {
      if (running < concurrency) {
        dequeue();
      }
    }

    function runComplete() {
      updateCount(count - 1);
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

    function updateCount(value: number) {
      count = value;
      onCountUpdated(count);
    }

    function updateRunning(value: number) {
      running = value;
      onRunningUpdated(running);
    }
  }

  function createDeferred() {
    let resolve;
    const promise = new Promise(r => {
      resolve = r;
    });
    return { promise, resolve };
  }
}
