import { delay, wrap } from "../operations";
import { createQueue, Queue } from "./queue";

describe("A queue", () => {
  let queue: Queue;

  beforeEach(() => {
    queue = createQueue();
  });

  it("should run action if empty", async () => {
    const action = () => Promise.resolve("run");

    const result = await queue.enqueue(action);

    expect(result).toEqual("run");
  });

  it("should run queued actions sequentially", async () => {
    const runs: string[] = [];

    const promises = [
      queue.enqueue(delay(30, () => runs.push("1"))),
      queue.enqueue(delay(20, () => runs.push("2"))),
      queue.enqueue(delay(10, () => runs.push("3"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1", "2", "3"]);
  });

  it("won't queue actions while capacity is reached", async () => {
    const runs: string[] = [];
    const myQueue = createQueue({ capacity: 2 });

    const promises = [
      myQueue.enqueue(delay(10, () => runs.push("1"))),
      myQueue.enqueue(delay(10, () => runs.push("2"))),
      myQueue.enqueue(delay(10, () => runs.push("3"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1", "2"]);
  });

  it("should queue actions when capacity is no more reached", async () => {
    const runs: string[] = [];
    const myQueue = createQueue({ capacity: 2 });

    const firstPromises = [
      myQueue.enqueue(delay(10, () => runs.push("1"))),
      myQueue.enqueue(delay(10, () => runs.push("2"))),
    ];
    await Promise.all(firstPromises);

    const secondPromises = [
      myQueue.enqueue(delay(10, () => runs.push("3"))),
      myQueue.enqueue(delay(10, () => runs.push("4"))),
    ];
    await Promise.all(secondPromises);

    expect(runs).toEqual(["1", "2", "3", "4"]);
  });

  it("should accept another action though previous one has failed", async () => {
    const runs: string[] = [];

    const promises = [
      queue
        .enqueue(() => Promise.reject("failure"))
        .catch(() => runs.push("failing action")),
      queue.enqueue(wrap(() => runs.push("second action"))),
    ];

    await Promise.all(promises);
    expect(runs).toContain("failing action");
    expect(runs).toContain("second action");
  });

  it("could be configured to run multiple actions concurrently", async () => {
    const runs: string[] = [];
    const myQueue = createQueue({ concurrency: 2 });

    const promises = [
      myQueue.enqueue(delay(30, () => runs.push("1"))),
      myQueue.enqueue(delay(10, () => runs.push("2"))),
      myQueue.enqueue(delay(15, () => runs.push("3"))),
      myQueue.enqueue(delay(20, () => runs.push("4"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["2", "3", "1", "4"]);
  });

  it("could be configured to run callback when running count is updated", async () => {
    const updates: number[] = [];
    const myQueue = createQueue({
      concurrency: 2,
      onRunningUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myQueue.enqueue(delay(10, () => undefined)),
      myQueue.enqueue(delay(50, () => undefined)),
      myQueue.enqueue(delay(100, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 1, 2, 1, 0]);
  });

  it("could be configured to run callback when count is updated", async () => {
    const updates: number[] = [];
    const myQueue = createQueue({
      onCountUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myQueue.enqueue(delay(10, () => undefined)),
      myQueue.enqueue(delay(50, () => undefined)),
      myQueue.enqueue(delay(100, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 3, 2, 1, 0]);
  });
});
