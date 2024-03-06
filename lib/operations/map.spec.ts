import { map, mapSeries, mapWithOptions } from "./map";
import { wrap } from "./wrap";

const options = {};
const identity = <T>(x: T) => Promise.resolve(x);

describe("Map with options", () => {
  it("should resolve when all applied promises are resolved", () => {
    const globalPromise = mapWithOptions(identity, options, [1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it("is auto curried", () => {
    const globalPromise = mapWithOptions(identity)(options)([1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it("could handle only 1 element", () => {
    const globalPromise = mapWithOptions(identity, options, [1]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1]);
    });
  });

  it("should resolve immediatly when no values", () => {
    const globalPromise = mapWithOptions(identity, options, []);

    return globalPromise.then((result) => {
      expect(result).toEqual([]);
    });
  });

  it("should return results in same order than values", () => {
    const globalPromise = mapWithOptions(decreasingDelay, options, [1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });

    function decreasingDelay(x: number) {
      return new Promise((resolve) => setTimeout(() => resolve(x), 30 / x));
    }
  });

  it("should reject if any promise is rejected", () => {
    const globalPromise = mapWithOptions(
      rejectFor2,
      { concurrency: 3 },
      [1, 2, 3],
    );

    return globalPromise.then(
      () => Promise.reject(new Error("Should fail")),
      (rejection: Error) => expect(rejection.message).toEqual("bleh"),
    );

    function rejectFor2(x: number) {
      return x === 2 ? Promise.reject(new Error("bleh")) : Promise.resolve();
    }
  });

  it("should reject with first error", () => {
    const globalPromise = mapWithOptions(
      rejectForGreaterThan2,
      { concurrency: 3 },
      [1, 2, 3],
    );

    return globalPromise.then(
      () => Promise.reject(new Error("Should fail")),
      (rejection: Error) => expect(rejection.message).toEqual("bleh2"),
    );

    function rejectForGreaterThan2(x: number) {
      return x >= 2 ? Promise.reject(new Error(`bleh${x}`)) : Promise.resolve();
    }
  });

  it("should run promises with regards of concurrency", () => {
    let maxConcurrentRuns = 0;
    let concurrentRuns = 0;
    const func = () =>
      wrap(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      })().then(() => concurrentRuns--);

    const functions = new Array(50).fill(func).map((f) => f);

    const globalPromise = mapWithOptions(
      (f) => f(),
      { concurrency: 4 },
      functions,
    );

    return globalPromise.then(() => {
      expect(maxConcurrentRuns).toEqual(4);
    });
  });

  it("should handle less values than concurrency setting", () => {
    const globalPromise = mapWithOptions(identity, { concurrency: 100 }, [1]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1]);
    });
  });
});

describe("Map", () => {
  it("should resolve when all applied promises are resolved", () => {
    const globalPromise = map(identity, [1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it("is auto curried", () => {
    const globalPromise = map(identity)([1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });
});

describe("Map series", () => {
  it("should resolve when all applied promises are resolved", () => {
    const globalPromise = mapSeries(identity, [1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it("is auto curried", () => {
    const globalPromise = mapSeries(identity)([1, 2, 3]);

    return globalPromise.then((result) => {
      expect(result).toEqual([1, 2, 3]);
    });
  });

  it("should run promises serially", () => {
    let maxConcurrentRuns = 0;
    let concurrentRuns = 0;
    const func = () =>
      wrap(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      })().then(() => concurrentRuns--);

    const functions = new Array(50).fill(func).map((f) => f);

    const globalPromise = mapSeries((f) => f(), functions);

    return globalPromise.then(() => {
      expect(maxConcurrentRuns).toEqual(1);
    });
  });
});
