'use strict';

const {timeout} = require('../lib');

timeout(300, slowFunction)()
  .then(() => console.log('Should have failed'))
  .catch(console.error);

function slowFunction() {
  return new Promise(resolve => setTimeout(resolve, 5000));
}
