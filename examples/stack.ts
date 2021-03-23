import { createStack } from "../lib";

const stack = createStack();

stack.push(() => eventuallyLog("1"));
stack.push(() => eventuallyLog("2"));
stack.push(() => eventuallyLog("3"));
stack.push(() => eventuallyLog("4"));
stack.push(() => eventuallyLog("5"));

function eventuallyLog(message: string) {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(message)
  );
}
