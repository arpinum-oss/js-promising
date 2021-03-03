import { delay, wrap } from "../operations";
import { createStack, Stack } from "./stack";

describe("A stack", () => {
  let stack: Stack;

  beforeEach(() => {
    stack = createStack();
  });

  it("should run action if empty", async () => {
    const action = () => Promise.resolve("run");

    const result = await stack.push(action);
    expect(result).toEqual("run");
  });

  it("should run stacked actions sequentially", async () => {
    const runs: string[] = [];

    const promises = [
      stack.push(delay(10, () => runs.push("1"))),
      stack.push(delay(20, () => runs.push("2"))),
      stack.push(delay(30, () => runs.push("3"))),
      stack.push(delay(40, () => runs.push("4"))),
      stack.push(delay(50, () => runs.push("5"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1", "5", "4", "3", "2"]);
  });

  it("should discard tail when capacity is reached", async () => {
    const runs: string[] = [];
    const myStack = createStack({ capacity: 2 });

    const promises = [
      myStack.push(delay(30, () => runs.push("1"))),
      myStack.push(delay(20, () => runs.push("2"))),
      myStack.push(delay(10, () => runs.push("3"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1", "3"]);
  });

  it("should discard item immediately if queue is running and capacity is reached", async () => {
    const runs: string[] = [];
    const myStack = createStack({ capacity: 1 });

    const promises = [
      myStack.push(delay(10, () => runs.push("1"))),
      myStack.push(delay(10, () => runs.push("2"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1"]);
  });

  it("should discard item immediately if queue is running multiple actions and capacity is reached", async () => {
    const runs: string[] = [];
    const myStack = createStack({ capacity: 2, concurrency: 2 });

    const promises = [
      myStack.push(delay(10, () => runs.push("1"))),
      myStack.push(delay(10, () => runs.push("2"))),
      myStack.push(delay(10, () => runs.push("3"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["1", "2"]);
  });

  it("should push actions normally when capacity is no more reached", async () => {
    const runs: string[] = [];
    const myStack = createStack({ capacity: 2 });

    const firstPromises = [
      myStack.push(delay(10, () => runs.push("1"))),
      myStack.push(delay(10, () => runs.push("2"))),
    ];
    await Promise.all(firstPromises);

    const secondPromises = [
      myStack.push(delay(10, () => runs.push("3"))),
      myStack.push(delay(10, () => runs.push("4"))),
    ];
    await Promise.all(secondPromises);

    expect(runs).toEqual(["1", "2", "3", "4"]);
  });

  it("should accept another action though previous one has failed", async () => {
    const runs: string[] = [];
    const myStack = createStack();

    const promises = [
      myStack
        .push(() => Promise.reject("failure"))
        .catch(() => runs.push("failing action")),
      myStack.push(wrap(() => runs.push("second action"))),
    ];

    await Promise.all(promises);
    expect(runs).toContain("failing action");
    expect(runs).toContain("second action");
  });

  it("could be configured to run multiple actions concurrently", async () => {
    const runs: string[] = [];
    const myStack = createStack({ concurrency: 2 });

    const promises = [
      myStack.push(delay(30, () => runs.push("1"))),
      myStack.push(delay(10, () => runs.push("2"))),
      myStack.push(delay(30, () => runs.push("3"))),
      myStack.push(delay(10, () => runs.push("4"))),
    ];

    await Promise.all(promises);
    expect(runs).toEqual(["2", "4", "1", "3"]);
  });

  it("could be configured to run callback when running count is updated", async () => {
    const updates: number[] = [];
    const myStack = createStack({
      concurrency: 2,
      onRunningUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(50, () => undefined)),
      myStack.push(delay(100, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 1, 2, 1, 0]);
  });

  it("should update running count correctly when tail is discarded", async () => {
    const updates: number[] = [];

    const myStack = createStack({
      capacity: 2,
      concurrency: 2,
      onRunningUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(10, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 1, 0]);
  });

  it("could be configured to run callback when count is updated", async () => {
    const updates: number[] = [];
    const myStack = createStack({
      onCountUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(50, () => undefined)),
      myStack.push(delay(100, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 3, 2, 1, 0]);
  });

  it("should update count correctly when tail is discarded", async () => {
    const updates: number[] = [];

    const myStack = createStack({
      capacity: 2,
      onCountUpdated: (value) => {
        updates.push(value);
      },
    });

    const promises = [
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(10, () => undefined)),
      myStack.push(delay(10, () => undefined)),
    ];

    await Promise.all(promises);
    expect(updates).toEqual([1, 2, 1, 0]);
  });
});
