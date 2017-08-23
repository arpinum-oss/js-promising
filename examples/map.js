'use strict';

const {map} = require('../lib');

const square = x => Promise.resolve(x * x);

map(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
