import { autoCurry } from './functions';

describe('Functions module', () => {
  describe('on auto curry', () => {
    it('should call function when all args are provided', () => {
      const autoCurried = autoCurry(add2);

      const result = autoCurried(1, 2);

      expect(result).toEqual(3);
    });

    it('should call function though more args are provided', () => {
      const autoCurried = autoCurry(add2);

      const result = autoCurried(1, 2, 3, 4, 5);

      expect(result).toEqual(3);
    });

    it('wont call function until all args are provided', () => {
      const autoCurried = autoCurry(inc);

      expect(autoCurried()()()()()()()()()(2)).toEqual(3);
    });

    it('should call function though it takes no args', () => {
      const autoCurried = autoCurry(always1);

      const result = autoCurried();

      expect(result).toEqual(1);
    });

    it('should partially apply function with given arg', () => {
      const autoCurried = autoCurry(add2);

      const result = autoCurried(1)(2);

      expect(result).toEqual(3);
    });

    it('should partially apply function with given args', () => {
      const autoCurried = autoCurry(add3);

      expect(autoCurried(1, 2)(3)).toEqual(6);
      expect(autoCurried(1)(2, 3)).toEqual(6);
    });
  });

  function always1() {
    return 1;
  }

  function inc(n) {
    return n + 1;
  }

  function add2(a, b) {
    return a + b;
  }

  function add3(a, b, c) {
    return a + b + c;
  }
});
