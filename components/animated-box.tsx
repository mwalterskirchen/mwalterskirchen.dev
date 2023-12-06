import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

export function AnimatedBox() {
    const mesh = useRef<Mesh>()

    useFrame(({ clock }) => {
        if (mesh.current) {
            mesh.current.rotation.y = clock.getElapsedTime()
        }
    })
    return (
        <mesh ref={mesh} castShadow={true} receiveShadow={true}>
            <boxGeometry />
            <meshBasicMaterial color="royalblue" />
        </mesh>
    )
}
