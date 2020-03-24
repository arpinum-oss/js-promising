// tslint:disable: no-console
import * as fs from "fs";
import { promisify } from "../lib";

const readdir = promisify(fs.readdir);

readdir(__dirname).then(console.log).catch(console.error);
