const { entrypoints } = require("uxp");
const app = require("photoshop").app;
const batchPlay = require("photoshop").action.batchPlay;
const fs = require("uxp").storage.localFileSystem;
const { Logger } = require("./js/Logger.js");
var PHI = (1 + Math.sqrt(5)) / 2;