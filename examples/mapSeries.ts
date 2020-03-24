// tslint:disable: no-console
import { mapSeries } from "../lib";

const square = (x: number) => Promise.resolve(x * x);

mapSeries(square, [1, 2, 3]).then(console.log); // [ 1, 4, 9 ]
