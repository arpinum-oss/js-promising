# Changelog

## 4.2.0 - UNRELEASED

### Added

- `createStack` function which is a LIFO equivalent to `createQueue`

## 4.1.0 - 2021-03-02

### Added

## 4.0.1 - 2021-02-10

- `endlessly` option for `retryWithOptions` operation which defaults to false

### Fixed

- `timeout` operation is more reliable on edge cases

## 4.0.0 - 2020-10-23

### Added

- `pipe` operation, which is same as `compose` but applies function from left to right

### Breaking changes

- `compose` applies function from right to left instead of left to right

## 3.1.1 - 2020-03-24

### Changed

- update development dependencies

## 3.1.0 - 2019-10-10

### Added

- `wait` operation
- `shouldRetry` option for `retryWithOptions` operation

## 3.0.0 - 2019-08-28

### Added

- `retry` operation

### Changed

- more precise TypeScript typing for most operations (no more `(...args:any[]): Promise<any>` functions)

### Breaking changes

- `timeout` operation is now a higher order function

## 2.3.0 - 2019-06-21

### Added

- `timeoutWithOptions` operation to customize error message
