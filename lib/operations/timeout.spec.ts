import { timeout, timeoutWithOptions } from "./timeout";

const slowFunction = () => new Promise(() => undefined);
const options = {};

describe("Timeout with options", () => {
  describe("creates a function that", () => {
    it("should reject when function takes to much time", () => {
      const withTimeout = timeoutWithOptions(10, options, slowFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) =>
          expect(rejection.message).toEqual("Timeout expired (10ms)")
      );
    });

    it("is auto curried", () => {
      const withTimeout = timeoutWithOptions(10)({})(slowFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) =>
          expect(rejection.message).toEqual("Timeout expired (10ms)")
      );
    });

    it("should reject with provided error factory", () => {
      const withTimeout = timeoutWithOptions(
        10,
        { createError: (d) => new Error(`> ${d}ms`) },
        slowFunction
      );

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) => expect(rejection.message).toEqual("> 10ms")
      );
    });

    it("should resolve when function is quick enough", () => {
      const quickFunction = () =>
        new Promise((resolve) => setTimeout(() => resolve("ok"), 10));
      const withTimeout = timeoutWithOptions(100, options, quickFunction);

      const promise = withTimeout();

      return promise.then((result) => {
        expect(result).toEqual("ok");
      });
    });

    it("should resolve though function does not return a promise", () => {
      const quickFunction = () => "ok";
      const withTimeout = timeoutWithOptions(100, options, quickFunction);

      const promise = withTimeout();

      return promise.then((result) => {
        expect(result).toEqual("ok");
      });
    });

    it("should forward promise rejection", () => {
      const failingFunction = () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Failure sorry")), 10)
        );
      const withTimeout = timeoutWithOptions(100, options, failingFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) => expect(rejection.message).toEqual("Failure sorry")
      );
    });
  });

  it("should pass all arguments to the created function", () => {
    const func = (...args: string[]) =>
      new Promise((resolve) => setTimeout(() => resolve([...args]), 10));
    const withTimeout = timeoutWithOptions(100, options, func);

    const promise = withTimeout("hello", "world");

    return promise.then((args) => {
      expect(args).toEqual(["hello", "world"]);
    });
  });
});

describe("Timeout", () => {
  describe("creates a function that", () => {
    it("should reject when function takes to much time", () => {
      const withTimeout = timeout(10, slowFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) =>
          expect(rejection.message).toEqual("Timeout expired (10ms)")
      );
    });

    it("is auto curried", () => {
      const withTimeout = timeout(10)(slowFunction);

      const promise = withTimeout();

      return promise.then(
        () => Promise.reject(new Error("Should fail")),
        (rejection) =>
          expect(rejection.message).toEqual("Timeout expired (10ms)")
      );
    });
  });
});
