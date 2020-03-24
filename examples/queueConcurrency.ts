// tslint:disable: no-console
import { createQueue } from "../lib";

const queue = createQueue({
  concurrency: 3,
  onRunningUpdated: (value) => console.log("Running: ", value),
});

queue.enqueue(() => eventuallyLog("1 done", 100));
queue.enqueue(() => eventuallyLog("2 done", 200));

setTimeout(() => {
  queue.enqueue(() => eventuallyLog("3 done", 200));
  queue.enqueue(() => eventuallyLog("4 done", 50));
  queue.enqueue(() => eventuallyLog("5 done", 100));
}, 150);

setTimeout(() => {
  queue.enqueue(() => eventuallyLog("6 done", 100));
  queue.enqueue(() => eventuallyLog("7 done", 200));
  queue.enqueue(() => eventuallyLog("8 done", 100));
}, 300);

function eventuallyLog(message: string, delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
    console.log(message)
  );
}
