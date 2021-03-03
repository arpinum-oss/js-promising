// tslint:disable: no-console
import { createStack } from "../lib";

const stack = createStack({ capacity: 2 });

stack.push(() => eventuallyLog("1"));
stack.push(() => eventuallyLog("2"));
stack.push(() => eventuallyLog("3"));

function eventuallyLog(message: string) {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(message)
  );
}
