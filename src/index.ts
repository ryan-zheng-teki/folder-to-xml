import generateXmlForFilesStruts from './lib/generateXmlStruts';

if(process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

let length = process.argv.length;
let outputPath  = process.argv[length-1];
let blogsDir = process.argv[length-2];

generateXmlForFilesStruts(blogsDir,outputPath);