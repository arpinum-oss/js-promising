import { map } from "../lib";

const square = (x: number) => Promise.resolve(x * x);

map(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
