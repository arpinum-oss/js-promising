import { AnyFunction } from "../types";
import { compose } from "./compose";

export function pipe(
  functions: AnyFunction[] = []
): (...args: any[]) => Promise<any> {
  return compose(functions.slice().reverse());
}
