'use strict';

const {autoCurry} = require('../functions');
const map = require('./map');

const modules = {
  compose: require('./compose'),
  delay: require('./delay'),
  map: (f, a) => map(f, null, a),
  mapSeries: (f, a) => map(f, {concurrency: 1}, a),
  mapWithOptions: map,
  promisify: require('./promisify'),
  timeout: require('./timeout'),
  wrap: require('./wrap')
};

module.exports = Object.entries(modules)
  .reduce((result, [key, value]) => Object.assign(result, {[key]: autoCurry(value)}), {});
