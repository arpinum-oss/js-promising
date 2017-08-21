# `compose(functions)`

Creates a function that returns a promise of the result of invoking the given functions, where each successive async invocation is supplied the return value of the previous.

#### Arguments

* `functions: function[]`: the functions to invoke

#### Return

* `(function)`:  a function returning a promise of the result

#### Example

```javascript
const {compose} = require('@arpinum/promising');

const add = (x, y) => Promise.resolve(x + y);
const square = x => Promise.resolve(x * x);
const addSquare = compose([add, square]);

addSquare(1, 2).then(console.log); // 9
```

# `delay(milliseconds)`

Creates a promise that is resolved after given milliseconds.

#### Arguments

* `milliseconds: number`: delay before resolution

#### Return

* `(Promise<void>)`

#### Example

```javascript
const {delay} = require('@arpinum/promising');

delay(2000).then(() => console.log('tick'));
```

# `map(values, func, options)`

Creates a promise that is resolved after having applied an async function to values.

#### Arguments

* `values: any[]`: values to map
* `func: function`: mapping function which may return a promise
* `options?: object`:
  * `concurrency?: number` number of promises to run concurrently. default is `3.

#### Return

* `(Promise)`: a promise either resolved with an array of all function results if all promises are resolved or rejected with the first error

#### Example

```javascript
const {map} = require('@arpinum/promising');

const square = x => Promise.resolve(x * x);

map([1, 2, 3], square).then(console.log); // [ 1, 4, 9 ]
```

# `mapSeries()`

Same as `map` but with `concurrency` option set to `1` to run only one promise at a time.

# `promisify(func)`

Promisify a function using an Error-first Node.js style callback.

#### Arguments

* `func: function`: a function using Node.js like convention

#### Return

* `(function)`: a function returning a promise

The function is either rejected with an error if 1st callback parameter is not null, or resolved with the result provided as 2nd parameter to the callback.  

#### Example

```javascript
const fs = require('fs');
const {promisify} = require('@arpinum/promising');

const readdir = promisify(fs.readdir);

readdir(__dirname)
  .then(console.log)
  .catch(console.error);
```

# `wrap(func)`

Wrap a function either returning an immediate value or a promise into another function returning only a promise.

If any error happens in synchronous code, the promise is rejected.

#### Arguments

* `func: function`: a function to wrap into another one

#### Return

* `(function)`: a function returning a promise containing the result either synchronous or promised

#### Example

```javascript
const {wrap} = require('@arpinum/promising');

const parse = wrap(JSON.parse);

parse('{"message": "ok"}')
  .then(o => console.log(o.message)); // ok

parse('[}')
  .catch(e => console.error(e.message)); // Unexpected token...
```

# `createQueue(options)`

#  `createQueueManager()`


