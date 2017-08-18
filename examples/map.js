'use strict';

const {map} = require('../lib');

const square = x => Promise.resolve(x * x);

map([1, 2, 3], square).then(console.log); // [ 1, 4, 9 ]
