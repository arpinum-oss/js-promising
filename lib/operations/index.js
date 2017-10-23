'use strict';

const map = require('./map');

module.exports = {
  compose: require('./compose'),
  delay: require('./delay'),
  map: (f, a) => map(f, null, a),
  mapSeries: (f, a) => map(f, {concurrency: 1}, a),
  mapWithOptions: map,
  promisify: require('./promisify'),
  timeout: require('./timeout'),
  wrap: require('./wrap')
};
