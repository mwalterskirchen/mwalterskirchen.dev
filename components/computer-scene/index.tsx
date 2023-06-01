import { BakeShadows, PerspectiveCamera } from '@react-three/drei'
import {
    Bloom,
    ChromaticAberration,
    EffectComposer,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Computers } from '@/components/computer-scene/computers'
import { Plane } from '@/components/computer-scene/plane'
import { useFrame } from 'react-three-fiber'
import { easing } from 'maath'
import Canvas from '@/components/canvas'

const ComputerScene = () => {
    useFrame((state, delta) => {
        easing.damp3(
            state.camera.position,
            [-1 + state.pointer.x / 3, (1 + state.pointer.y) / 2, 5.5],
            0.5,
            delta
        )
        state.camera.lookAt(0, 0, 0)
    })
    return (
        <>
            <PerspectiveCamera makeDefault fov={50} position={[1, 2, 5]} />
            <color args={[0, 0, 0]} attach="background" />
            <hemisphereLight intensity={0.15} groundColor="black" />
            <spotLight
                color={[1, 0.25, 0.7]}
                intensity={0.8}
                angle={0.6}
                penumbra={0.5}
                position={[5, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <spotLight
                color={[0.14, 0.5, 1]}
                intensity={0.8}
                angle={0.6}
                penumbra={0.5}
                position={[-5, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <Computers />
            <Plane />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0}
                    mipmapBlur
                    luminanceSmoothing={0.0}
                    intensity={10}
                    blendFunction={BlendFunction.ADD}
                />
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL} // blend mode
                    //@ts-ignore
                    offset={[0.0005, 0.0012]} // color offset
                />
            </EffectComposer>
            <BakeShadows />
        </>
    )
}
export default ComputerScene
