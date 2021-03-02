"use strict";

const { readFile } = require("fs");
const { promisify } = require("util");
const { retryWithOptions } = require("../build");

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retryWithOptions(
  { endlessly: true, onTryError },
  readFileAsync
);

function onTryError(error) {
  console.error(`Attempt failed: ${error.message}`);
  console.log("Waiting a little then retrying");
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

readFileAsyncWithRetry("not-existing.json", "utf-8")
  .then(console.log)
  .catch(console.error);
