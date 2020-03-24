# Auto-currying

Promise operations have fixed arities to support auto-currying.

With auto-currying all the following instructions would return the same result:

```javascript
add(1, 2, 3); // 6
add(1, 2)(3); // 6
add(1)(2)(3); // 6
```

Thus, you can store any intermediate function to reuse it :

```javascript
const add1 = add(1);
add1(2, 3); // 6
```

Example with [`delay` operation](api.md#delaymilliseconds-func):

```javascript
const { delay } = require("@arpinum/promising");

const delay1s = delay(1000);
delay1s(console.log)("I am", "late");
```

Example with [`map` operation](api.md#mapfunc-values) operation:

```javascript
const { map } = require("@arpinum/promising");

const mapRound = map(Math.round);
mapRound([1.2, 5.7, 9.9]).then(console.log); // [ 1, 6, 10 ]
```
