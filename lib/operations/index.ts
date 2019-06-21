import { autoCurry } from '../functions';
import { compose as rawCompose } from './compose';
import { delay as rawDelay } from './delay';
import { map as rawMap } from './map';
import { promisify as rawPromisify } from './promisify';
import { timeout as rawTimeout } from './timeout';
import { wrap as rawWrap } from './wrap';

export const compose = autoCurry(rawCompose);
export const delay = autoCurry(rawDelay);
export const map = autoCurry((f, a) => rawMap(f, {}, a));
export const mapSeries = autoCurry((f, a) => rawMap(f, { concurrency: 1 }, a));
export const mapWithOptions = autoCurry(rawMap);
export const promisify = autoCurry(rawPromisify);
export const timeout = autoCurry((d, f) => rawTimeout(d, {}, f));
export const timeoutWithOptions = autoCurry(rawTimeout);
export const wrap = autoCurry(rawWrap);
