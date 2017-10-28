function autoCurry(func) {
  return withGatheredArgs;

  function withGatheredArgs(...gatheredArgs) {
    if (gatheredArgs.length >= func.length) {
      return func(...gatheredArgs);
    }
    return (...args) => withGatheredArgs(...gatheredArgs, ...args);
  }
}

module.exports = {
  autoCurry
};
