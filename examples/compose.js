"use strict";

const { compose } = require("../build");

const add = (x, y) => Promise.resolve(x + y);
const square = (x) => Promise.resolve(x * x);
const addSquare = compose([square, add]);

addSquare(1, 2).then(console.log); // 9
