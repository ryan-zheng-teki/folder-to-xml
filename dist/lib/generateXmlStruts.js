"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
let fd;
let nextWork = null;
function generateXmlForFilesStruts(rootDir, targetFile) {
    try {
        fd = fs_1.default.openSync(targetFile, 'w');
        let rootNode = createRootNode(rootDir);
        nextWork = rootNode;
        while (nextWork != null) {
            nextWork = beginWork(nextWork);
        }
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        if (fd !== undefined)
            fs_1.default.closeSync(fd);
    }
}
exports.generateXmlForFilesStruts = generateXmlForFilesStruts;
/* beginWork for dir
(1)create the start tag
(2)list all items in the directory. and create the children nodes.
If children are also directories, then create Dir Nodes. If all children are
files, then create files nodes.
If the directory is empty, return the next node to be processed.
*/
function beginWork(currentNode) {
    if (currentNode.tag & types_1.NodeTag.DIR_FLAG) {
        createXmlStartTag(currentNode);
        let items = fs_1.default.readdirSync(currentNode.path);
        //empty directory
        if (items.length === 0) {
            return finishWork(currentNode);
        }
        let siblingNode = null;
        for (let i = items.length - 1; i >= 0; i--) {
            let itemPath = currentNode.path + '/' + items[i];
            let childNode = createChildNode(itemPath, currentNode, siblingNode);
            siblingNode = childNode;
        }
        //return the first node for the children.
        return siblingNode;
    }
    else {
        //this node must be a file.So we create a file xml node
        createFileXmlNode(currentNode);
        return finishWork(currentNode);
    }
}
/*
If the item is one directory. Then we create a directory node.
If the item is a file then we create a file node
*/
function createChildNode(itemPath, parentNode, siblingNode) {
    let stats = fs_1.default.statSync(itemPath);
    if (stats.isDirectory()) {
        return {
            path: itemPath,
            indent: parentNode.indent + 5,
            parentNode: parentNode,
            next: siblingNode,
            tag: types_1.NodeTag.DIR_FLAG,
        };
    }
    else {
        return {
            path: itemPath,
            indent: parentNode.indent + 5,
            parentNode: parentNode,
            next: siblingNode,
            createdTime: stats.ctime,
            modifiedTime: stats.mtime,
            tag: types_1.NodeTag.FILE_FLAG,
        };
    }
}
/*
(1)if this node is directory, create the end tag for the currentNode.
(2)if this node is not directory. Then it must be a file

when i finish the currentNode.I should start to process my siblingNode for beginWork().Then finishWork should returns the siblingNode
But if i have no sibling, Then i should go back go my parent. My parent obviously have already called beginWork.So my parent should
also call finishWork, then If my parent has a sibling. Then it should return it's sibling for the beginWork processing.
*/
function finishWork(currentNode) {
    let nextWork = currentNode;
    while (nextWork != null) {
        //we only create end tag for directory. Because file xml nodes are created already for file node in beginwork
        if (nextWork.tag & types_1.NodeTag.DIR_FLAG) {
            createXmlEndTag(nextWork);
        }
        if (nextWork.next == null) {
            nextWork = nextWork.parentNode;
            continue;
        }
        if (nextWork.next != null) {
            return nextWork.next;
        }
    }
    //nextWork is null, which means that we have processed the root node.
    return null;
}
/*
create root node
*/
function createRootNode(rootDir) {
    return {
        path: rootDir,
        indent: 0,
        parentNode: null,
        next: null,
        tag: types_1.NodeTag.DIR_FLAG,
    };
}
//write the xml start tag to the file descriptor
function createXmlStartTag(directoryNode) {
    let spaces = ' '.repeat(directoryNode.indent);
    fs_1.default.appendFileSync(fd, spaces + '<' + getLastPart(directoryNode) + '>\n', 'utf8');
}
//create xml end tag
function createXmlEndTag(directoryNode) {
    let spaces = ' '.repeat(directoryNode.indent);
    fs_1.default.appendFileSync(fd, spaces + '</' + getLastPart(directoryNode) + '>\n', 'utf8');
}
function createFileXmlNode(fileNode) {
    let spaces = ' '.repeat(fileNode.indent);
    fs_1.default.appendFileSync(fd, spaces + '<File>\n', 'utf8');
    createFileNameTag(fileNode);
    createFilePathTag(fileNode);
    createCreatedTimeTag(fileNode);
    createModifiedTimeTag(fileNode);
    createFileEndTag(fileNode);
}
function createModifiedTimeTag(fileNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs_1.default.appendFileSync(fd, spaces + '<modifiedTime>' + fileNode.modifiedTime + '</modifiedTime>\n', 'utf8');
}
function createFilePathTag(fileNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs_1.default.appendFileSync(fd, spaces + '<path>' + fileNode.path + '</path>\n', 'utf8');
}
function createFileNameTag(fileNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs_1.default.appendFileSync(fd, spaces + '<name>' + getLastPart(fileNode) + '</name>\n', 'utf8');
}
function createCreatedTimeTag(fileNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs_1.default.appendFileSync(fd, spaces + '<createdTime>' + fileNode.createdTime + '</createdTime>\n', 'utf8');
}
function createFileEndTag(fileNode) {
    let spaces = ' '.repeat(fileNode.indent);
    fs_1.default.appendFileSync(fd, spaces + '</File>\n', 'utf8');
}
function getLastPart(currentNode) {
    let arr = currentNode.path.split('/');
    return arr[arr.length - 1];
}
exports.default = generateXmlForFilesStruts;
