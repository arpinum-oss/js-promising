import { readFile } from "fs";
import { promisify } from "util";
import { retryWithOptions } from "../lib";

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retryWithOptions(
  { count: 5, onTryError, onFinalError },
  readFileAsync
);

function onTryError(error: Error) {
  console.error(`Attempt failed: ${error.message}`);
  console.log("Waiting a little then retrying");
  return new Promise((resolve) => setTimeout(resolve, 500));
}

function onFinalError(error: Error) {
  console.error(`Last attempt failed: ${error.message}`);
}

readFileAsyncWithRetry("package.json", "utf-8")
  .then(console.log)
  .catch(console.error);
