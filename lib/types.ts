export type PromisifiedReturnType<F extends AnyFunction> = Promisified<
  ReturnType<F>
>;

export type PromisifiedFunction<F extends AnyFunction> = (
  ...args: Parameters<F>
) => Promisified<ReturnType<F>>;

type Promisified<T> = [T] extends [never]
  ? Promise<never>
  : T extends Promise<any>
    ? T
    : Promise<T>;

export type AnyFunction = (...args: any[]) => any;
