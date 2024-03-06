import { readFile } from "fs";
import { promisify } from "util";
import { retryWithOptions } from "../lib";

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retryWithOptions(
  { endlessly: true, onTryError },
  readFileAsync,
);

function onTryError(error: Error) {
  console.error(`Attempt failed: ${error.message}`);
  console.log("Waiting a little then retrying");
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

readFileAsyncWithRetry("not-existing.json", "utf-8")
  .then(console.log)
  .catch(console.error);
