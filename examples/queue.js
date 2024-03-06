"use strict";

const { createQueue } = require("../build");

const queue = createQueue();

queue.enqueue(() => eventuallyLog("1"));
queue.enqueue(() => eventuallyLog("2"));
queue.enqueue(() => eventuallyLog("3"));

function eventuallyLog(message) {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(message),
  );
}
