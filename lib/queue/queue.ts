import { createDeferred, Resolve } from "../promises";
import { AnyFunction } from "../types";

export interface QueueOptions {
  capacity?: number;
  concurrency?: number;
  onRunningUpdated?: (count: number) => void;
  onCountUpdated?: (count: number) => void;
}

interface QueueItem {
  next: QueueItem | null;
  resolve: Resolve<void>;
}

export interface Queue {
  enqueue: (action: AnyFunction) => Promise<any>;
}

export function createQueue(options?: QueueOptions): Queue {
  const {
    capacity,
    concurrency,
    onRunningUpdated,
    onCountUpdated,
  } = Object.assign(
    {},
    {
      capacity: Number.MAX_SAFE_INTEGER,
      concurrency: 1,
      onRunningUpdated: () => undefined,
      onCountUpdated: () => undefined,
    },
    options
  );
  let head: QueueItem | null = null;
  let tail: QueueItem | null = null;
  let count = 0;
  let running = 0;

  return { enqueue };

  async function enqueue(action: AnyFunction) {
    if (capacityReached()) {
      return;
    }
    const { resolve, promise } = createDeferred();
    add();
    dequeueIfPossible();

    await promise;
    try {
      return await action();
    } finally {
      runComplete();
    }

    function capacityReached() {
      return count >= capacity;
    }

    function add() {
      if (head !== null) {
        const newTail = { resolve, next: null };
        (tail as QueueItem).next = newTail;
        tail = newTail;
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
}
