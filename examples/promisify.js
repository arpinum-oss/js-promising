"use strict";

const fs = require("fs");
const { promisify } = require("../build");

const readdir = promisify(fs.readdir);

readdir(__dirname).then(console.log).catch(console.error);
