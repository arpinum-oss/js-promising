// tslint:disable: no-console
import { wait } from "../lib";

console.log("Waiting");

const twoSecondsLater = wait(2000);

twoSecondsLater().then(() => console.log("Go go go !"));
