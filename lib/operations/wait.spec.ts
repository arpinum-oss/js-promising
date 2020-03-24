import { wait } from "./wait";

describe("Wait", () => {
  describe("creates a function that", () => {
    it("should resolve after the given ms", async () => {
      const start = new Date();

      await wait(300)();

      const stop = new Date();
      expect(stop.getTime() - start.getTime()).toBeGreaterThan(200);
    });
  });
});
