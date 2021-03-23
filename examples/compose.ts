import { compose } from "../lib";

const add = (x: number, y: number) => Promise.resolve(x + y);
const square = (x: number) => Promise.resolve(x * x);
const addSquare = compose([square, add]);

addSquare(1, 2).then(console.log); // 9
