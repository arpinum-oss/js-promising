# Changelog

## 3.1.1 - 2020-03-24

### Changed

- update development dependencies

## 3.1.0 - 2019-10-10

### Added

- `wait` operation
- `shouldRetry` option for `retry` operation

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
