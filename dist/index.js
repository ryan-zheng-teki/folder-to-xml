#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateXmlStruts_1 = __importDefault(require("./lib/generateXmlStruts"));
const fs_1 = __importDefault(require("fs"));
if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/to/directory targetXmlFile");
    process.exit(-1);
}
let length = process.argv.length;
let outputPath = process.argv[length - 1];
let blogsDir = process.argv[length - 2];
if (!fs_1.default.existsSync(blogsDir)) {
    console.log(blogsDir + " does not exist");
    process.exit(1);
}
generateXmlStruts_1.default(blogsDir, outputPath);
