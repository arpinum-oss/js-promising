'use strict';

const { mapWithOptions } = require('../lib');

const square = x => Promise.resolve(x * x);

mapWithOptions(square, { concurrency: 2 }, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
