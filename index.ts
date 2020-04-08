#!/usr/bin/env node
import generateXmlForFilesStruts from './lib/generateXmlStruts';

if(process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/to/directory targetXmlFile");
    process.exit(-1);
}

let length = process.argv.length;
let outputPath  = process.argv[length-1];
let blogsDir = process.argv[length-2];

generateXmlForFilesStruts(blogsDir,outputPath);