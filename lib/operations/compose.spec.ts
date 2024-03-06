import { AnyFunction } from "../types";
import { compose } from "./compose";
import { delay } from "./delay";

describe("Compose", () => {
  it("should create a promise function applying all functions from right to left", () => {
    const runs: string[] = [];
    const functions = [
      delay(20, () => runs.push("2")),
      delay(10, () => runs.push("1")),
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(["1", "2"]);
    });
  });

  it("could handle no function", () => {
    const functions: AnyFunction[] = [];

    const globalPromise = compose(functions)("hello");

    return globalPromise.then((result) => {
      expect(result).toEqual("hello");
    });
  });

  it("could handle only one function", () => {
    const runs: string[] = [];
    const functions = [delay(1, () => runs.push("1"))];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(["1"]);
    });
  });

  it("should preserve order", () => {
    const runs: string[] = [];
    const functions = [
      delay(10, () => runs.push("2")),
      delay(20, () => runs.push("1")),
    ];

    const globalPromise = compose(functions)();

    return globalPromise.then(() => {
      expect(runs).toEqual(["1", "2"]);
    });
  });

  it("should supply return value of the previous function to the next", () => {
    const functions = [
      delay(10, (result) => [...result, "3"]),
      delay(10, (result) => [...result, "2"]),
      delay(10, (result) => [...result, "1"]),
    ];

    const globalPromise = compose(functions)(["initial"]);

    return globalPromise.then((result) => {
      expect(result).toEqual(["initial", "1", "2", "3"]);
    });
  });

  it("should handle sync and async functions", () => {
    const functions: ((f: string[]) => void)[] = [
      (result) => [...result, "3"],
      delay(10, (result) => [...result, "2"]),
      (result) => [...result, "1"],
    ];

    const globalPromise = compose(functions)(["initial"]);

    return globalPromise.then((result) => {
      expect(result).toEqual(["initial", "1", "2", "3"]);
    });
  });

  it("should handle rejections", () => {
    const functions: ((f: string[]) => void)[] = [
      (result) => [...result, "3"],
      () => Promise.reject(new Error("bleh")),
      (result) => [...result, "1"],
    ];

    const globalPromise = compose(functions)(["initial"]);

    return globalPromise.then(
      () => Promise.reject(new Error("Should fail")),
      (rejection) => expect(rejection.message).toEqual("bleh"),
    );
  });

  it("should allow first function to have any number of arguments", () => {
    const add = (x: number, y: number) => Promise.resolve(x + y);
    const square = (x: number) => Promise.resolve(x * x);
    const addSquare = compose([square, add]);

    return addSquare(1, 2).then((result) => {
      expect(result).toEqual(9);
    });
  });
});
