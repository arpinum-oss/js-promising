'use strict';

const delay = require('./delay');
const mapSeries = require('./mapSeries');

describe('Map series', () => {

  it('should run promises sequentially', () => {
    const runs = [];
    const functions = [
      () => delay(20).then(() => {
        runs.push('1');
        return '1';
      }),
      () => delay(10).then(() => {
        runs.push('2');
        return '2';
      }),
      () => delay(1).then(() => {
        runs.push('3');
        return '3';
      })
    ];

    const globalPromise = mapSeries(functions, f => f());

    return globalPromise.then(results => {
      results.should.deep.equal(['1', '2', '3']);
      runs.should.deep.equal(['1', '2', '3']);
    });
  });
});
