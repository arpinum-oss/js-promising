'use strict';

const {wrap} = require('../lib');

const parse = wrap(JSON.parse);

parse('{"message": "ok"}')
  .then(o => console.log(o.message)); // ok

parse('[}')
  .catch(e => console.error(e.message)); // Unexpected token...
