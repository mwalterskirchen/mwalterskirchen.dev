import { FileNode } from './file-system'

import type { FileTree } from './file-system'

export enum CommandEnum {
    HELP = 'help',
    CLEAR = 'clear',
    WHOAMI = 'whoami',
    ABOUT = 'about',
    PWD = 'pwd',
    LS = 'ls',
    CD = 'cd',
    CONTACT = 'contact',
    CV = 'cv',
    MKDIR = 'mkdir',
    TOUCH = 'touch',
    CAT = 'cat',
    ECHO = 'echo',
}

export const processCommand = ({
    command,
    visitorIP,
    fileSystem,
}: {
    command: string
    fileSystem: FileTree
    visitorIP: string
}) => {
    const [cmd, ...args] = command.split(' ')
    switch (cmd) {
        case CommandEnum.HELP:
            return Object.values(CommandEnum).join(', ')
        case CommandEnum.CLEAR:
            return CommandEnum.CLEAR
        case CommandEnum.WHOAMI:
            return `Seems like you are visiting from ${visitorIP}`
        case CommandEnum.ABOUT:
            return 'about'
        case CommandEnum.PWD:
            return 'pwd'
        case CommandEnum.LS:
            return fileSystem.toString()
        case CommandEnum.CD:
            return 'cd'
        case CommandEnum.CONTACT:
            return 'contact'
        case CommandEnum.CV:
            return 'cv'
        case CommandEnum.MKDIR:
            const dir = new FileNode('dir', args[0], '')
            fileSystem.add(dir)
            return ''
        case CommandEnum.TOUCH:
            const file = new FileNode('file', args[0], '')
            fileSystem.add(file)
            return ''
        default:
            return 'unknown'
    }
}
