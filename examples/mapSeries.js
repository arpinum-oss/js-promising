'use strict';

const { mapSeries } = require('../lib');

const square = x => Promise.resolve(x * x);

mapSeries(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
