import Link from 'next/link'

export const Navigation = () => {
    return (
        <nav className="flex justify-between items-center m-auto">
            <Link href="/">main</Link>
            <Link href={'/writeups'}>writeups</Link>
            <Link href={'/contact'}>contact</Link>
        </nav>
    )
}
