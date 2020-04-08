#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateXmlStruts_1 = __importDefault(require("./lib/generateXmlStruts"));
if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/to/directory targetXmlFile");
    process.exit(-1);
}
let length = process.argv.length;
let outputPath = process.argv[length - 1];
let blogsDir = process.argv[length - 2];
generateXmlStruts_1.default(blogsDir, outputPath);
