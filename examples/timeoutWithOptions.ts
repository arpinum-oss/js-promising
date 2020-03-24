// tslint:disable: no-console
import { timeoutWithOptions } from "../lib";

timeoutWithOptions(
  300,
  { createError },
  resolveAfter
)(5000)
  .then(() => console.log("Will not be called"))
  .catch(console.error);

function createError(delay: number) {
  return new Error(`Too slow (>${delay}ms)`);
}

function resolveAfter(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
