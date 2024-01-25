export class FileTree {
    private root: FileNode

    constructor() {
        this.root = new FileNode('dir', '/')
    }

    public getRoot(): FileNode {
        return this.root
    }

    public add(file: FileNode): void {
        const pathParts = file
            .getKey()
            .split('/')
            .filter((part) => part !== '')
        let currentNode = this.root
        pathParts.forEach((part) => {
            if (!currentNode.hasChild(part)) {
                currentNode.addChild(new FileNode('file', part))
            }
            currentNode = currentNode.getChild(part) as FileNode
        })
    }

    public get(path: string): FileNode | undefined {
        const pathParts = path.split('/').filter((part) => part !== '')
        let currentNode = this.root
        pathParts.forEach((part) => {
            if (!currentNode.hasChild(part)) {
                return
            }
            currentNode = currentNode.getChild(part) as FileNode
        })
        return currentNode
    }

    public remove(path: string): void {
        const pathParts = path.split('/').filter((part) => part !== '')
        let currentNode = this.root
        pathParts.forEach((part) => {
            if (!currentNode.hasChild(part)) {
                return
            }
            currentNode = currentNode.getChild(part) as FileNode
        })
    }

    public toString(): string {
        const queue: FileNode[] = []
        queue.push(this.root)
        let result = ''
        while (queue.length > 0) {
            const node = queue.shift() as FileNode
            result += `${node.toString()}\n`
            node.getChildren().forEach((child) => queue.push(child))
        }
        return result
    }
}

type FileNodeType = 'file' | 'dir'

export class FileNode {
    private children: FileNode[]
    private key: string
    private type: FileNodeType

    constructor(type: FileNodeType, key: string) {
        this.children = []
        this.key = key
        this.type = type
    }

    public addChild(child: FileNode) {
        this.children.push(child)
    }

    public getKey(): string {
        return this.key
    }

    public getChildren(): FileNode[] {
        return this.children
    }

    public getChild(key: string): FileNode | undefined {
        return this.children.find((child) => child.getKey() === key)
    }

    public hasChild(key: string): boolean {
        return this.children.some((child) => child.getKey() === key)
    }

    public removeChild(key: string): void {
        this.children = this.children.filter((child) => child.getKey() !== key)
    }

    public getType(): string {
        return this.type
    }

    public toString(): string {
        return `${this.key} - ${this.type}`
    }
}
