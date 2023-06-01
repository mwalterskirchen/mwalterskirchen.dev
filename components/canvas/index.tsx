'use client'
import { Canvas as ThreeCanvas } from 'react-three-fiber'
import { ReactNode } from 'react'
const Canvas = ({ children }: { children: ReactNode }) => {
    return (
        <section className={'h-screen w-screen'}>
            <ThreeCanvas shadows>{children}</ThreeCanvas>
        </section>
    )
}

export default Canvas
