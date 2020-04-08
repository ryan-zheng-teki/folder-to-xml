#!/usr/bin/env node
import generateXmlForFilesStruts from './lib/generateXmlStruts';
import fs from 'fs';

if(process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/to/directory targetXmlFile");
    process.exit(-1);
}

let length = process.argv.length;
let outputPath  = process.argv[length-1];
let blogsDir = process.argv[length-2];

if (!fs.existsSync(blogsDir)) {
    console.log(blogsDir + " does not exist");
    process.exit(1);
}

generateXmlForFilesStruts(blogsDir,outputPath);