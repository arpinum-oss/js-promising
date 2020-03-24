// tslint:disable: no-console
import { mapWithOptions } from "../lib";

const square = (x: number) => Promise.resolve(x * x);

mapWithOptions(square, { concurrency: 2 }, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
