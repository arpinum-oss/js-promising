import { createDeferred, Resolve } from "../promises";
import { AnyFunction } from "../types";

export interface StackOptions {
  capacity?: number;
  concurrency?: number;
  onRunningUpdated?: (count: number) => void;
  onCountUpdated?: (count: number) => void;
}

interface StackItem {
  next: StackItem | null;
  previous: StackItem | null;
  resolve: Resolve<boolean>;
}

export interface Stack {
  push: (action: AnyFunction) => Promise<any>;
}

export function createStack(options?: StackOptions): Stack {
  const { capacity, concurrency, onRunningUpdated, onCountUpdated } =
    Object.assign(
      {},
      {
        capacity: Number.MAX_SAFE_INTEGER,
        concurrency: 1,
        onRunningUpdated: () => undefined,
        onCountUpdated: () => undefined,
      },
      options
    );
  let head: StackItem | null = null;
  let tail: StackItem | null = null;
  let count = 0;
  let running = 0;

  return { push };

  async function push(action: AnyFunction) {
    const { resolve, promise } = createDeferred<boolean>();
    add();
    popIfPossible();

    const run = await promise;
    if (!run) {
      return;
    }
    try {
      return await action();
    } finally {
      runComplete();
    }

    function add() {
      if (head !== null) {
        replaceHead(head);
      } else {
        createHeadAndTail();
      }
      if (capacityReached()) {
        discardTail();
      } else {
        updateCount(count + 1);
      }
    }

    function replaceHead(headToReplace: StackItem) {
      head = { resolve, next: headToReplace, previous: null };
      headToReplace.previous = head;
    }

    function createHeadAndTail() {
      head = { resolve, next: null, previous: null };
      tail = head;
      tail.previous = head;
    }

    function discardTail() {
      if (tail !== null) {
        tail.resolve(false);
        if (tail === head) {
          tail = null;
          head = null;
        } else {
          tail = tail.previous;
          if (tail !== null) {
            tail.next = null;
          }
        }
      }
    }

    function capacityReached() {
      return count >= capacity;
    }

    function popIfPossible() {
      if (running < concurrency) {
        pop();
      }
    }

    function runComplete() {
      updateCount(count - 1);
      updateRunning(running - 1);
      pop();
    }

    function pop() {
      if (head !== null) {
        updateRunning(running + 1);
        head.resolve(true);
        head = (head as StackItem).next;
        if (head !== null) {
          head.previous = null;
        }
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
