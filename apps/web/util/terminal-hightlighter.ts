import type { Highlighter } from 'xterm-readline/lib/highlight'

export class TerminalHighlighter implements Highlighter {
    COMMANDS: string[]

    constructor(knownCommands: string[]) {
        this.COMMANDS = knownCommands
    }

    highlight(line: string): string {
        const command = line.trim().split(' ')[0]

        if (this.COMMANDS.includes(command)) {
            // highlight in #2DD4BF and make bold
            return `\x1b[1m\x1b[38;2;45;212;191m${line}\x1b[0m\x1b[22m`
        }
        return line
    }
    highlightPrompt(prompt: string): string {
        return prompt
    }
    highlightChar(line: string): boolean {
        if (this.COMMANDS.includes(line)) {
            return true
        }
        return false
    }
}
