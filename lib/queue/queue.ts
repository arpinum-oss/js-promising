import { AnyFunction } from '../types';

export interface QueueOptions {
  capacity?: number;
  concurrency?: number;
  onRunningUpdated?: (count: number) => void;
  onCountUpdated?: (count: number) => void;
}

type Resolve = () => void;

interface QueueItem {
  next: QueueItem | null;
  resolve: Resolve;
}

export interface Queue {
  enqueue: (action: AnyFunction) => Promise<any>;
}

export function createQueue(options?: QueueOptions): Queue {
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
  let head: QueueItem | null = null;
  let tail: QueueItem | null = null;
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
      if (head !== null) {
        (tail as QueueItem).next = { resolve: newResolve, next: null };
        tail = (tail as QueueItem).next;
      } else {
        head = { resolve, next: null };
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
      if (head !== null) {
        updateRunning(running + 1);
        head.resolve();
        head = (head as QueueItem).next;
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
    let resolve: Resolve = () => undefined;
    const promise = new Promise(r => {
      resolve = r;
    });
    return { promise, resolve };
  }
}
