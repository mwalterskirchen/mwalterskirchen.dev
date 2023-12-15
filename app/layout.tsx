import './globals.css'
import { fira, inter } from '@/util'
import { Navigation } from '@/components/navigation'

import type { ReactNode } from 'react'

export const metadata = {
    title: 'Maximilian Walterskirchen: Aspiring Security Professional & Full Stack Developer',
    description:
        'Enter the dynamic tech world of Maximilian Walterskirchen, a Full Stack Web Developer with a growing focus on Security. ' +
        'Delve into his professional experiences at functn, his educational journey in Computer Science at TU Wien, and his dedication to expanding his security knowledge, ' +
        'complemented by his love for CTFs and espresso artistry.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`bg-zinc-950 text-white ${fira.variable} ${inter.variable} font-mono min-h-screen pl-24 pr-24 pt-8 pb-8 max-w-screen-xl m-auto`}
            >
                <header>
                    <Navigation />
                </header>
                {children}
            </body>
        </html>
    )
}
