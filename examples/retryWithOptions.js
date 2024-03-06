"use strict";

const { readFile } = require("fs");
const { promisify } = require("util");
const { retryWithOptions } = require("../build");

const readFileAsync = promisify(readFile);

const readFileAsyncWithRetry = retryWithOptions(
  { count: 5, onTryError, onFinalError },
  readFileAsync,
);

function onTryError(error) {
  console.error(`Attempt failed: ${error.message}`);
  console.log("Waiting a little then retrying");
  return new Promise((resolve) => setTimeout(resolve, 500));
}

function onFinalError(error) {
  console.error(`Last attempt failed: ${error.message}`);
}

readFileAsyncWithRetry("package.json2", "utf-8")
  .then(console.log)
  .catch(console.error);
