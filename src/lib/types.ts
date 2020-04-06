
export enum NodeTag {
    DIR_FLAG = 1,
    FILE_FLAG = 2
}

export interface WorkNode {
    path: string,
    indent: number,
    parentNode: WorkNode
    next: WorkNode,
    createdTime?: Date
    modifiedTime?: Date
    tag: NodeTag
}
