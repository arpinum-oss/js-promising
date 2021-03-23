export type Resolve<T> = (value: T | PromiseLike<T>) => void;

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: Resolve<T>;
}

export function createDeferred<T>(): Deferred<T> {
  let resolve: Resolve<T> | undefined = undefined;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  if (resolve === undefined) {
    throw new Error("Resolve should not be undefined");
  }
  return { promise, resolve };
}
