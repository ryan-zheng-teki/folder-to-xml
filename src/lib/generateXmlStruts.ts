import fs from 'fs';
import { WorkNode, NodeTag} from './types';

let fd: any;
let nextWork = null;
export function generateXmlForFilesStruts(rootDir,targetFile) {
    try {
        fd = fs.openSync(targetFile, 'w');
        let rootNode: WorkNode = createRootNode(rootDir);
        nextWork = rootNode;

        while(nextWork != null) {
            nextWork = beginWork(nextWork);
        }
    }
    catch (err) {
        console.log(err);
        process.exit(1);
      } finally {
        if (fd !== undefined)
          fs.closeSync(fd);
    } 
}

/* beginWork for dir
(1)create the start tag
(2)list all items in the directory. and create the children nodes. 
If children are also directories, then create Dir Nodes. If all children are
files, then create files nodes. 
If the directory is empty, return the next node to be processed. 
*/
function beginWork(currentNode): WorkNode {
    if(currentNode.tag & NodeTag.DIR_FLAG) {
        createXmlStartTag(currentNode);
        let items = fs.readdirSync(currentNode.path);

        //empty directory
        if( items.length === 0) {
            return finishWork(currentNode);
        }

        let siblingNode = null;
        for(let i = items.length - 1; i >= 0; i--) {
            let itemPath = currentNode.path + '/' + items[i];
            let childNode = createChildNode(itemPath,currentNode,siblingNode);
            siblingNode = childNode;
        }
        
        //return the first node for the children.
        return siblingNode;
    } else{
        //this node must be a file.So we create a file xml node
        createFileXmlNode(currentNode);
        return finishWork(currentNode);
    }
}

/* 
If the item is one directory. Then we create a directory node.
If the item is a file then we create a file node
*/
function createChildNode(itemPath,parentNode,siblingNode): WorkNode {
    let stats = fs.statSync(itemPath);
    if(stats.isDirectory()) {
        return {
            path: itemPath,
            indent: parentNode.indent + 5,
            parentNode: parentNode,
            next: siblingNode,
            tag: NodeTag.DIR_FLAG,
        }
    } else {
        return {
            path: itemPath,
            indent: parentNode.indent + 5,
            parentNode: parentNode,
            next: siblingNode,
            createdTime: stats.ctime,
            modifiedTime: stats.mtime,
            tag: NodeTag.FILE_FLAG,
        } 
    }
}
/* 
(1)if this node is directory, create the end tag for the currentNode.
(2)if this node is not directory. Then it must be a file

when i finish the currentNode.I should start to process my siblingNode for beginWork().Then finishWork should returns the siblingNode
But if i have no sibling, Then i should go back go my parent. My parent obviously have already called beginWork.So my parent should
also call finishWork, then If my parent has a sibling. Then it should return it's sibling for the beginWork processing.
*/
function finishWork(currentNode): WorkNode {
    let nextWork = currentNode;
    while(nextWork != null) {
        //we only create end tag for directory. Because file xml nodes are created already for file node in beginwork
        if(nextWork.tag & NodeTag.DIR_FLAG) {
            createXmlEndTag(nextWork);
        }
        if(nextWork.next == null) {
            nextWork = nextWork.parentNode;
            continue;
        }

        if(nextWork.next != null) {
            return nextWork.next;
        }
    }
    //nextWork is null, which means that we have processed the root node.
    return null;
}

/*
create root node
*/
function createRootNode(rootDir): WorkNode {
    return {
        path: rootDir,
        indent: 0,
        parentNode: null,
        next: null,
        tag: NodeTag.DIR_FLAG,
    }
} 

//write the xml start tag to the file descriptor
function createXmlStartTag(directoryNode:WorkNode){
    let spaces = ' '.repeat(directoryNode.indent);
    fs.appendFileSync(fd, spaces + '<' + getLastPart(directoryNode) + '>\n', 'utf8');
}

//create xml end tag
function createXmlEndTag(directoryNode:WorkNode){
    let spaces = ' '.repeat(directoryNode.indent);
    fs.appendFileSync(fd, spaces + '</' + getLastPart(directoryNode) + '>\n', 'utf8');
}

function createFileXmlNode(fileNode:WorkNode) {
    let spaces = ' '.repeat(fileNode.indent);
    fs.appendFileSync(fd, spaces + '<File>\n', 'utf8');
    
    createFileNameTag(fileNode);
    createCreatedTimeTag(fileNode);
    createModifiedTimeTag(fileNode);

    createFileEndTag(fileNode);
}

function createModifiedTimeTag(fileNode:WorkNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs.appendFileSync(fd, spaces + '<modifiedTime>'+ fileNode.modifiedTime+'</modifiedTime>\n', 'utf8');
}

function createFileNameTag(fileNode:WorkNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs.appendFileSync(fd, spaces + '<name>'+ getLastPart(fileNode) + '</name>\n', 'utf8');
}

function createCreatedTimeTag(fileNode:WorkNode) {
    let spaces = ' '.repeat(fileNode.indent + 3);
    fs.appendFileSync(fd, spaces + '<createdTime>'+ fileNode.createdTime+'</createdTime>\n', 'utf8');
}

function createFileEndTag(fileNode:WorkNode) {
    let spaces = ' '.repeat(fileNode.indent);
    fs.appendFileSync(fd, spaces + '</File>\n', 'utf8');
}

function getLastPart(currentNode:WorkNode) {
    let arr = currentNode.path.split('/');
    return arr[arr.length-1];
}

export default generateXmlForFilesStruts;