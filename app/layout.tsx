import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Maximilian Walterkirchen - Full Stack Software Engineer',
  description: '🔭 Full Stack Engineer from Vienna, Austria 🇦🇹 Balancing a love for ☕ coffee with a passion for building brilliant software. Always brewing up fresh code! 💻',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
