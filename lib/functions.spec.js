const functions = require('./functions');

describe('Functions module', () => {
  context('on auto curry', () => {
    it('should call function when all args are provided', () => {
      const autoCurried = functions.autoCurry(add2);

      const result = autoCurried(1, 2);

      result.should.equal(3);
    });

    it('should call function though more args are provided', () => {
      const autoCurried = functions.autoCurry(add2);

      const result = autoCurried(1, 2, 3, 4, 5);

      result.should.equal(3);
    });

    it('wont call function until all args are provided', () => {
      const autoCurried = functions.autoCurry(inc);

      autoCurried()()()()()()()()()(2).should.equal(3);
    });

    it('should call function though it takes no args', () => {
      const autoCurried = functions.autoCurry(always1);

      const result = autoCurried();

      result.should.equal(1);
    });

    it('should partially apply function with given arg', () => {
      const autoCurried = functions.autoCurry(add2);

      const result = autoCurried(1)(2);

      result.should.equal(3);
    });

    it('should partially apply function with given args', () => {
      const autoCurried = functions.autoCurry(add3);

      autoCurried(1, 2)(3).should.equal(6);
      autoCurried(1)(2, 3).should.equal(6);
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
