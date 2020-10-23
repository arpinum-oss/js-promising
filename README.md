# @arpinum/promising [![Build Status](https://travis-ci.org/arpinum-oss/js-promising.svg?branch=master)](https://travis-ci.org/arpinum-oss/js-promising)

> A promise made is a debt unpaid.  
> <cite>Robert W. Service</cite>

_@arpinum/promising_ is a simple module that provides basic operations on promises.

This module is functional programming friendly, thus many functions have fixed arities to support auto-currying and data-last arguments.

## Installation

```
npm install @arpinum/promising --save
```

## Features

- [`compose` operation](docs/api.md#composefunctions)
- [`delay` operation](docs/api.md#delaymilliseconds-func)
- [`map` operation](docs/api.md#mapfunc-values)
- [`mapSeries` operation](docs/api.md#mapseriesfunc-values)
- [`mapWithOptions` operation](docs/api.md#mapwithoptionsfunc-options-values)
- [`pipe` operation](docs/api.md#pipefunctions)
- [`promisify` operation](docs/api.md#promisifyfunc)
- [`retry` operation](docs/api.md#retrycount-func)
- [`retryWithOptions` operation](docs/api.md#retrywithoptionscount-options-func)
- [`timeout` operation](docs/api.md#timeoutmilliseconds-func)
- [`timeoutWithOptions` operation](docs/api.md#timeoutwithoptionsmilliseconds-options-func)
- [`wait` operation](docs/api.md#waitmilliseconds)
- [`wrap` operation](docs/api.md#wrapfunc)
- [auto-currying](docs/auto-currying.md)
- [queue object](docs/api.md#createqueueoptions)

## Docs

- [API](docs/api.md)

## License

[MIT](LICENSE)
