import TerminalWindow from '@/components/terminal-window'
import { Avatar } from '@/components/avatar'
import { getAllWriteups } from '@/util/get-all-writeups'

export default function Home() {
    getAllWriteups()
    return (
        <>
            <Avatar />
            <h1 className="text-2xl mb-4">
                Hi, I&apos;m{' '}
                <span className={'underline underline-offset-4 text-teal-400 text-center'}>
                    Max
                </span>
                ! 👋🏻
            </h1>
            <h2 className={'text-center'}>
                Merging the Art of Full Stack Web Development and Computer Science with a
                Security Focus at TU Wien, while Relishing in CTF Challenges 🔐, Diving into
                Video Games 👾, and Crafting Artisanal Espresso ☕.
            </h2>
            <TerminalWindow />
        </>
    )
}
