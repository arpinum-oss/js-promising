'use strict';

const {delay} = require('../lib');

delay(2000, console.log)('tic')
  .then(() => console.log('tac'));
