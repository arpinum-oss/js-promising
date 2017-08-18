'use strict';

const {compose} = require('../lib');

const add = (x, y) => Promise.resolve(x + y);
const square = x => Promise.resolve(x * x);
const addSquare = compose([add, square]);

addSquare(1, 2).then(console.log); // 9
