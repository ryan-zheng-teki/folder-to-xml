# Introduction
This package npm tool is used to convert a folder structure into xml file


# Algorithm
We used nonrecursive way of parsing the tree to generate the xml nodes

The data structure used in this algorithm is. The work flow is
 
node {
    parent
    sibling
}  

# Work flow
Process the current item, after processing the current item, then continue 
with its sibling. If the current item does not have sibling, then go back to its parent.

# How To Use
npm install folder-to-xml
<b>folder-to-xml source-folder-name targt-file</b>