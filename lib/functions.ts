import { AnyFunction } from './types';

export function autoCurry<T extends AnyFunction>(func: T): AnyFunction {
  return withGatheredArgs as T;

  function withGatheredArgs(...gatheredArgs: any[]): any {
    if (gatheredArgs.length >= func.length) {
      return func(...gatheredArgs);
    }
    return (...args: any[]) => withGatheredArgs(...gatheredArgs, ...args);
  }
}
