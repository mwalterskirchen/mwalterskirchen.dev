import './globals.css'
import { fira } from '@/util'

import type { ReactNode } from 'react'

export const metadata = {
    title: 'Maximilian Walterkirchen - Full Stack Software Engineer',
    description:
        '🔭 Full Stack Engineer from Vienna, Austria 🇦🇹 Balancing a love for ☕ coffee with a passion for building brilliant software. Always brewing up fresh code! 💻',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`bg-zinc-950 text-white ${fira.variable} font-mono`}
            >
                {children}
            </body>
        </html>
    )
}
