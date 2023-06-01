import { useGLTF } from '@react-three/drei'

export function Computers() {
    const gltf = useGLTF('/assets/computer/scene.gltf')
    return (
        <mesh castShadow receiveShadow position={[0, 0, 1]} scale={0.5}>
            <primitive object={gltf.scene} />
        </mesh>
    )
}
