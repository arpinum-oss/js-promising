import { wrap } from "../lib";

const parse = wrap(JSON.parse);

parse('{"message": "ok"}').then((o: { message: string }) =>
  console.log(o.message)
); // ok

parse("[}").catch((e: Error) => console.error(e.message)); // Unexpected token...
