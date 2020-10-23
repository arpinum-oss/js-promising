"use strict";

const { pipe } = require("../build");

const add = (x, y) => Promise.resolve(x + y);
const square = (x) => Promise.resolve(x * x);
const addSquare = pipe([add, square]);

addSquare(1, 2).then(console.log); // 9
