export type Resolve = (value?: unknown) => void;

export function createDeferred() {
  let resolve: Resolve = () => undefined;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
