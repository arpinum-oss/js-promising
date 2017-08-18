# `compose` operation

Creates a function that returns a promise of the result of invoking the given functions, where each successive async invocation is supplied the return value of the previous.

## Usage

`compose(functions)`

* `functions` `{Array<Function>}`: the functions to invoke.
* returns: `Function` returning a promise.

## Example

```javascript
const {compose} = require('@arpinum/promising');

const add = (x, y) => Promise.resolve(x + y);
const square = x => Promise.resolve(x * x);
const addSquare = compose([add, square]);

addSquare(1, 2).then(console.log); // 9
```

# `delay` operation

# `map` operation

# `mapSeries` operation

# `promisify` operation

# `wrap` operation

# queue object

#  queue manager object


