# compose(functions)

- `functions: Array<function>` - Functions to invoke from right to left.
- returns: `function` - Function returning a promise of the result.

Creates a function that returns a promise of the result of invoking the given functions from right to left, where each successive async invocation is supplied the return value of the previous.

Example:

```javascript
const { compose } = require("@arpinum/promising");

const add = (x, y) => Promise.resolve(x + y);
const square = (x) => Promise.resolve(x * x);
const addSquare = compose([square, add]);

addSquare(1, 2).then(console.log); // 9
```

See [`pipe`](#pipefunctions) if you prefer invoking functions from left to right.

# delay(milliseconds, func)

- `milliseconds: number` - Delay before calling function.
- `func: function` - Function to be delayed. May return a promise.
- returns: `function` - Function returning a promise.

Creates a function that delays a given function forwarding any arguments.

Example:

```javascript
const { delay } = require("@arpinum/promising");

delay(2000, console.log)("I am late");
```

If you just want to wait some time without delaying another function consider using [wait operation](#waitmilliseconds).

# map(func, values)

- `func: function` - Mapping function which may return a promise.
- `values: Array<any>` - Values to map.
- returns: `Promise<Array<any>>` - Promise either resolved with an array of all function results if all promises are resolved or rejected with the first error.

Creates a promise that is resolved after having applied an async function to values.

Example:

```javascript
const { map } = require("@arpinum/promising");

const square = (x) => Promise.resolve(x * x);

map(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# mapSeries(func, values)

Same as `mapWithOptions` but with `concurrency` option set to 1 to run only one promise at a time.

Example:

```javascript
const { mapSeries } = require("@arpinum/promising");

const square = (x) => Promise.resolve(x * x);

mapSeries(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# mapWithOptions(func, options, values)

- `options: Object`
  - `concurrency?: number` - Number of promises to run concurrently. Defaults to 3.

Same as `map` but with some options.

Example:

```javascript
const { mapWithOptions } = require("@arpinum/promising");

const square = (x) => Promise.resolve(x * x);

mapWithOptions(square, { concurrency: 2 }, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
```

# pipe(functions)

- `functions: Array<function>` - Functions to invoke from left to right.
- returns: `function` - Function returning a promise of the result.

Same as [`compose`](#composefunctions) except function order is from left to right.

Example:

```javascript
const { pipe } = require("@arpinum/promising");

const add = (x, y) => Promise.resolve(x + y);
const square = (x) => Promise.resolve(x * x);
const addSquare = pipe([add, square]);

addSquare(1, 2).then(console.log); // 9
```

# promisify(func)

Promisifies a function using an Error-first Node.js style callback.

- `func: function` - Function using Node.js like convention.
- returns: `function` - Function returning a promise.

The function is either rejected with an error if 1st callback parameter is not null, or resolved with the result provided as 2nd parameter to the callback.

Example:

```javascript
const fs = require("fs");
const { promisify } = require("@arpinum/promising");

const readdir = promisify(fs.readdir);

readdir(__dirname).then(console.log).catch(console.error);
```

# retry(count, func)

- `count: number` - The attempts to retry the function call if any error occurs.
- `func: function` - Function likely to fail but could eventually succeed after other attempts. Should usually return a promise.
- returns: `function` - Function returning a promise.

Creates a function that decorates another one forwarding any arguments. The resulting function will be called until it succeed or there is no more attempt left.

To avoid any confusion, if `count` equals `3`, `func` will be called once then 3 other times, so the total call count will be 4.

Example:

```javascript
const { retry } = require("@arpinum/promising");
```

# retryWithOptions(options, func)

- `options: Object`
  - `count?: number` - The attempts to retry the function call if any error occurs. Defaults to 3.
  - `endlessly?: boolean` - To retry endlessly except when `shouldRetry` is provided and not satisfied. Defaults to false.
  - `onTryError?: function` - A function called with each error except last one. Could return a promise and the next attempt will wait for its resolution.
  - `onFinalError?: function` - A function called with the last error. Could return a promise.
  - `shouldRetry?: function` - A function called with each error to determine if we should retry. Could return a promise.

Same as `retry` but with some options.

Example:

```javascript
const { retryWithOptions } = require("@arpinum/promising");
```

# timeout(milliseconds, func)

- `milliseconds: number` - Delay before expiration.
- `func: function` - Function to be prevented from timeout. Should usually return a promise.
- returns: `function` - Function returning a promise.

Creates a function that decorates another one forwarding any arguments. The resulting function returns a promise rejected if decorated function takes too much time.

Example:

```javascript
const { timeout } = require("@arpinum/promising");

timeout(
  300,
  resolveAfter
)(5000)
  .then(() => console.log("Will not be called"))
  .catch(console.error);

function resolveAfter(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
```

# timeoutWithOptions(milliseconds, options, func)

- `options: Object`
  - `createError?: function` - Factory function used to create the thrown error. Delay is provided when called.

Same as `timeout` but with some options.

Example:

```javascript
const { timeoutWithOptions } = require("@arpinum/promising");

timeoutWithOptions(
  300,
  { createError },
  resolveAfter
)(5000)
  .then(() => console.log("Will not be called"))
  .catch(console.error);

function createError(delay) {
  return new Error(`Too slow (>${delay}ms)`);
}

function resolveAfter(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
```

# wait(milliseconds)

- `milliseconds: number` - Delay before resolving.
- returns: `function` - Function returning a promise resolving after the provided delay.

Example:

```javascript
const { wait } = require("@arpinum/promising");

console.log("Waiting");

const twoSecondsLater = wait(2000);

twoSecondsLater().then(() => console.log("Go go go !"));
```

# wrap(func)

- `func: function` - Function to wrap into another one.
- returns: `function` - Function returning a promise containing the result either synchronous or promised.

Wraps a function either returning an immediate value or a promise into another function returning only a promise.

If any error happens in synchronous code, the promise is rejected.

Example:

```javascript
const { wrap } = require("@arpinum/promising");

const parse = wrap(JSON.parse);

parse('{"message": "ok"}').then((o) => console.log(o.message)); // ok

parse("[}").catch((e) => console.error(e.message)); // Unexpected token...
```

# createQueue(options)

- `options: Object`
  - `capacity: number` - Maximum number of function either running or queued. When capacity is reached following enqueued functions are ignored. Defaults to unlimited.
  - `concurrency: number` - Number of promises to run concurrently. Defaults to 1.
  - `onRunningUpdated: function` - Callback function called when running function count is updated. Count is passed as argument. Does nothing by default.
  - `onCountUpdated: function` - Callback function called when function count is updated. Count is passed as argument. Does nothing by default.
- returns: `Queue`

Creates a [Queue](#queue-object) object which can enqueue functions returning a promise and dequeue them sequentially.

Example:

```javascript
const { createQueue } = require("@arpinum/promising");

const queue = createQueue({ capacity: 3 });

queue.enqueue(() => eventuallyLog("1"));
queue.enqueue(() => eventuallyLog("2"));
queue.enqueue(() => eventuallyLog("3"));

function eventuallyLog(message) {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(message)
  );
}
```

# Queue object

## queue.enqueue(func)

- `func: function` - Function to exectute that may return a promise or an immediate value.
- returns: `Promise<any>` - Promise resolved when enqueued function has been dequeued.
