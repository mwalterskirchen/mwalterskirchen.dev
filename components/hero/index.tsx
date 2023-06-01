'use client'

import ComputerScene from '@/components/computer-scene'
import Canvas from '@/components/canvas'

const Hero = () => {
    return (
        <section className={'overflow-x-hidden'}>
            <Canvas>
                <ComputerScene />
            </Canvas>
        </section>
    )
}

export default Hero
