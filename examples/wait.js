'use strict';

const { wait } = require('../build');

console.log('Waiting');

const twoSecondsLater = wait(2000);

twoSecondsLater().then(() => console.log('Go go go !'));
