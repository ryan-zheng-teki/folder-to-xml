
Algorithm
We used non recursive way of parsing the directories.

(1)set current to be the input directory, list all the items in the directory
create a dirNode {
    dir: current
    parent: parentNode,
    sibling:

}

How to set sibling. We could only set sibling after reading the dir. Which means for items. That means.
The job for processing the currentNode.
case 1. If it contains only directories 
directory {
    name;
    next;
    parent;
}
then construct a list of directories objects. Each object has a sibling to the next object.And each directory 
has parent as the current.
The last object does not have sibling.Then we generate one xml node with the name of the first directory object.The last one
could set next to be null, parent not null. Then it means we finished processing all the directoris. Then we should
set the current to be the parent's sibling(parent.next). If parent.next is null. Then we should check parent.parent.next
When we use child, then we add indent. When we go to parent, we decrease indent.

then set the current to be the directory. parent to be the current.
case 2. If its files, then create a list of files nodes.each node contains the files information createdTime,modifiedTime.
set the current to be parent.
*/ 