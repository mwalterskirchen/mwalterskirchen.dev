import Link from 'next/link'

import type { FC, PropsWithChildren } from 'react'

export const Navigation = () => {
    return (
        <nav className="flex justify-between items-center m-auto mb-8">
            <NavLink href={'/'}>main</NavLink>
            <NavLink href={'/writeups'}>writeups</NavLink>
            <NavLink href={'/contact'}>contact</NavLink>
        </nav>
    )
}

const NavLink: FC<{ href: string } & PropsWithChildren> = ({ href, children }) => (
    <Link
        className={
            'flex-1 flex justify-center hover:underline transition-all hover:text-teal-400'
        }
        href={href}
    >
        {children}
    </Link>
)
