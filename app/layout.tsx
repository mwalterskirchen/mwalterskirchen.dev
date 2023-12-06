import './globals.css'
import { Fira_Code } from 'next/font/google'

const fira = Fira_Code({ subsets: ['latin'], variable: '--font-fira' })

export const metadata = {
    title: 'Maximilian Walterkirchen - Full Stack Software Engineer',
    description:
        '🔭 Full Stack Engineer from Vienna, Austria 🇦🇹 Balancing a love for ☕ coffee with a passion for building brilliant software. Always brewing up fresh code! 💻',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
