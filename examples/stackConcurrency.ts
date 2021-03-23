import { createStack } from "../lib";

const stack = createStack({
  concurrency: 3,
  onRunningUpdated: (value) => console.log("Running: ", value),
});

stack.push(() => eventuallyLog("1 done", 100));
stack.push(() => eventuallyLog("2 done", 200));

setTimeout(() => {
  stack.push(() => eventuallyLog("3 done", 200));
  stack.push(() => eventuallyLog("4 done", 50));
  stack.push(() => eventuallyLog("5 done", 100));
}, 150);

setTimeout(() => {
  stack.push(() => eventuallyLog("6 done", 100));
  stack.push(() => eventuallyLog("7 done", 200));
  stack.push(() => eventuallyLog("8 done", 100));
}, 300);

function eventuallyLog(message: string, delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
    console.log(message)
  );
}
