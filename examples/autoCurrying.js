'use strict';

const { autoCurry } = require('../lib/functions');

const rawAdd = (a, b, c) => a + b + c;
const add = autoCurry(rawAdd);
console.log(add(1, 2, 3)); // 6
console.log(add(1, 2)(3)); // 6
console.log(add(1)(2)(3)); // 6

const { delay } = require('../lib');

const delay1s = delay(1000);
delay1s(console.log)('I am', 'late');

const { map } = require('../lib');

const mapRound = map(Math.round);
mapRound([1.2, 5.7, 9.9]).then(console.log); // [ 1, 6, 10 ]
