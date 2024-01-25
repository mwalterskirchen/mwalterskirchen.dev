'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { Readline } from 'xterm-readline'

import { TerminalHighlighter } from '@/util/terminal-hightlighter'
import { CommandEnum, processCommand } from '@/util/process-command'
import { FileTree } from '@/util/file-system'

const COMMANDS = Object.values(CommandEnum)

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xterm = useRef<XTerm>()
    const directory = useRef<string>('~')
    const rl = useMemo(() => new Readline(), [])
    const fileSystem = useMemo(() => new FileTree(), [])
    const [visitorIP, setVisitorIP] = useState('')

    const readLine = useCallback(() => {
        const processLine = (command: string) => {
            const action = processCommand({
                command,
                fileSystem,
                visitorIP,
            })
            if (action === CommandEnum.CLEAR) {
                xterm.current?.clear()
                setTimeout(readLine)
            } else {
                rl.println(action)
                setTimeout(readLine)
            }
        }

        rl.read('\x1b[1m\x1b[38;2;45;212;191m→ ~ \x1b[0m\x1b[22m').then(processLine)
    }, [fileSystem, rl, visitorIP])

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then((response) => response.json())
            .then((data) => setVisitorIP(data.ip))
    }, [])

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
            xterm.current.write(`$ ${directory.current} `)

            rl.setCheckHandler((text) => {
                const trimmedText = text.trimEnd()
                if (trimmedText.endsWith('&&')) {
                    return false
                }
                return true
            })

            const highlighter = new TerminalHighlighter(COMMANDS)

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
