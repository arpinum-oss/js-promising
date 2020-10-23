import { pipe } from "./pipe";
import { delay } from "./delay";

describe("Pipe", () => {
  it("should create a promise function applying all functions from left to right", () => {
    const runs: string[] = [];
    const functions = [
      delay(10, () => runs.push("1")),
      delay(20, () => runs.push("2")),
    ];

    const globalPromise = pipe(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(["1", "2"]);
    });
  });
});
