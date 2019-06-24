// tslint:disable: no-console
import { wrap } from '../build';

const parse = wrap(JSON.parse);

parse('{"message": "ok"}').then((o: any) => console.log(o.message)); // ok

parse('[}').catch((e: Error) => console.error(e.message)); // Unexpected token...
