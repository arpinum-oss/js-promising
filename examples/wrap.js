'use strict';

const {wrap} = require('../lib');

const succeeding = wrap(() => JSON.parse('{"message": "ok"}'));
succeeding.then(o => console.log(o.message)); // ok

const failing = wrap(() => JSON.parse('[}'));
failing.catch(e => console.error(e.message)); // Unexpected token...
