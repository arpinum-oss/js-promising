'use strict';

const map = require('./map');

function mapSeries(values, func) {
  return map(values, func, {concurrency: 1});
}

module.exports = mapSeries;
