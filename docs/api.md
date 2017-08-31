# compose(functions)

* `functions` `Array<function>` Functions to invoke
* returns: `function` Function returning a promise of the result

Creates a function that returns a promise of the result of invoking the given functions, where each successive async invocation is supplied the return value of the previous.

Example:

```javascript
const {compose} = require('@arpinum/promising');

const add = (x, y) => Promise.resolve(x + y);
const square = x => Promise.resolve(x * x);
const addSquare = compose([add, square]);

addSquare(1, 2).then(console.log); // 9
```

# delay(milliseconds)

* `milliseconds` `number` Delay before resolution
* returns: `Promise<void>`

Creates a promise that is resolved after given milliseconds.

Example:

```javascript
const {delay} = require('@arpinum/promising');

delay(2000).then(() => console.log('tick'));
```

# map(func, values)

* `func` `function` Mapping function which may return a promise
* `values` `Array<any>` Values to map
* returns: `Promise` Promise either resolved with an array of all function results if all promises are resolved or rejected with the first error

Creates a promise that is resolved after having applied an async function to values.

Example:

```javascript
const {map} = require('@arpinum/promising');

const square = x => Promise.resolve(x * x);

map(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# mapSeries(func, values)

Same as `mapWithOptions` but with `concurrency` option set to 1 to run only one promise at a time.

Example:

```javascript
const {mapSeries} = require('@arpinum/promising');

const square = x => Promise.resolve(x * x);

mapSeries(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# mapWithOptions(func, options, values)

* `options` `Object`
  * `concurrency` `number` Number of promises to run concurrently. Defaults to 3.

Same as `map` but with some options.

Example:

```javascript
const {mapWithOptions} = require('@arpinum/promising');

const square = x => Promise.resolve(x * x);

mapWithOptions(square, {concurrency: 2}, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# promisify(func)

Promisifies a function using an Error-first Node.js style callback.

* `func` `function` Function using Node.js like convention
* returns: `function` Function returning a promise

The function is either rejected with an error if 1st callback parameter is not null, or resolved with the result provided as 2nd parameter to the callback.  

Example:

```javascript
const fs = require('fs');
const {promisify} = require('@arpinum/promising');

const readdir = promisify(fs.readdir);

readdir(__dirname)
  .then(console.log)
  .catch(console.error);
```

# wrap(func)

Wraps a function either returning an immediate value or a promise into another function returning only a promise.

* `func` `function` Function to wrap into another one
* returns: `function` Function returning a promise containing the result either synchronous or promised

If any error happens in synchronous code, the promise is rejected.

Example:

```javascript
const {wrap} = require('@arpinum/promising');

const parse = wrap(JSON.parse);

parse('{"message": "ok"}')
  .then(o => console.log(o.message)); // ok

parse('[}')
  .catch(e => console.error(e.message)); // Unexpected token...
```

# createQueue(options)

* `options` `Object`
  * `capacity` `number` Maximum number of function either running or queued. When capacity is reached following enqueued functions are ignored. Defaults to unlimited.
* returns: `Queue`

Creates a `queue` object which can enqueue functions returning a promise and dequeue them sequentially.

Example:

```javascript
const {createQueue} = require('@arpinum/promising');

const queue = createQueue({capacity: 3});

queue.enqueue(() => eventuallyLog('1'));
queue.enqueue(() => eventuallyLog('2'));
queue.enqueue(() => eventuallyLog('3'));

function eventuallyLog(message) {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => console.log(message));
}
```

# class: Queue

## queue.enqueue(func)

* `func` `function` Function to exectute that may return a promise or an immediate value
* returns: `Promise` Promise resolved when enqueued function has been dequeued 
