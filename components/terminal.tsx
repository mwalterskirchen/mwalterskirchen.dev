'use client'

import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null)
    const xterm = useRef<XTerm>()

    useEffect(() => {
        if (terminalRef.current) {
            xterm.current = new XTerm({
                fontFamily: 'Fira Code',
                fontSize: 14,
                theme: { background: '#1f2937' },
            })
            const fitAddon = new FitAddon()
            xterm.current.loadAddon(fitAddon)
            xterm.current.open(terminalRef.current)
            fitAddon.fit()
            xterm.current.writeln('Welcome to my website!')

            // xterm.current.onData(handleInput)
        }

        return () => {
            xterm.current?.dispose()
        }
    }, [])

    return <div className={'w-full'} ref={terminalRef} />
}

export default Terminal
