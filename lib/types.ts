export type AnyFunction = (...args: any[]) => any;
export type PromiseMaybeFunction<T> = (...args: any[]) => Promise<T> | T;
export type PromiseFunction<T> = (...args: any[]) => Promise<T>;
