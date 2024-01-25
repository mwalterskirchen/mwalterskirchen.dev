'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { Readline } from 'xterm-readline'

import type { Highlighter } from 'xterm-readline/lib/highlight'

const COMMANDS = ['help', 'clear']

class CustomHighlighter implements Highlighter {
    highlight(line: string): string {
        const command = line.trim().split(' ')[0]

        if (COMMANDS.includes(command)) {
            // highlight in #2DD4BF and make bold
            return `\x1b[1m\x1b[38;2;45;212;191m${line}\x1b[0m\x1b[22m`
        }
        return line
    }
    highlightPrompt(prompt: string): string {
        return prompt
    }
    highlightChar(line: string): boolean {
        if (COMMANDS.includes(line)) {
            return true
        }
        return false
    }
}

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xterm = useRef<XTerm>()
    const directory = useRef<string>('~')
    const rl = useMemo(() => new Readline(), [])

    const readLine = useCallback(() => {
        const processLine = (text: string) => {
            rl.println('you entered: ' + text)
            setTimeout(readLine)
        }

        rl.read('\x1b[1m\x1b[38;2;45;212;191m→ ~ \x1b[0m\x1b[22m').then(processLine)
    }, [rl])

    useEffect(() => {
        if (terminalRef.current) {
            xterm.current = new XTerm({
                fontSize: 16,
                theme: { background: '#1f2937', cursorAccent: '#1f2937' },
                cursorBlink: true,
                cursorStyle: 'block',
            })
            const fitAddon = new FitAddon()

            xterm.current.loadAddon(fitAddon)
            xterm.current.loadAddon(rl)
            xterm.current.open(terminalRef.current)
            fitAddon.fit()
            xterm.current.writeln('Welcome to my website!')
            xterm.current.write(`$ ${directory.current} `)

            rl.setCheckHandler((text) => {
                const trimmedText = text.trimEnd()
                if (trimmedText.endsWith('&&')) {
                    return false
                }
                return true
            })

            const highlighter = new CustomHighlighter()

            rl.setHighlighter(highlighter)

            readLine()
        }

        return () => {
            xterm.current?.dispose()
        }
    }, [readLine, rl])

    return <div className={'w-full'} ref={terminalRef} />
}

export default Terminal
