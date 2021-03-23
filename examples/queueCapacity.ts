import { createQueue } from "../lib";

const queue = createQueue({ capacity: 2 });

let iterations = 0;

const interval = setInterval(() => {
  const iteration = iterations++;
  console.log(`Pushing #${iteration}`);
  queue.enqueue(() => eventuallyPrint(iteration));
}, 300);

setTimeout(() => clearInterval(interval), 5000);

function eventuallyPrint(iteration: number) {
  return new Promise((resolve) => setTimeout(resolve, 700)).then(() =>
    console.log(`Processing #${iteration}`)
  );
}
