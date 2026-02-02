'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Float, MeshWobbleMaterial, Text, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface ArtItemProps {
    position: [number, number, number]
    name: string
    artist: string
    image: string
}

function ArtPedestal({ position, name, artist, image }: ArtItemProps) {
    const [hovered, setHovered] = useState(false)
    const texture = useLoader(THREE.TextureLoader, image)

    return (
        <group position={position}>
            {/* Painting Frame */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    castShadow
                >
                    <boxGeometry args={[1.5, 2, 0.05]} />
                    <meshStandardMaterial map={texture} />
                </mesh>

                {/* Frame border */}
                <mesh position={[0, 0, -0.01]}>
                    <boxGeometry args={[1.6, 2.1, 0.05]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.8} />
                </mesh>
            </Float>

            {/* Pedestal Base */}
            <mesh position={[0, -1.8, 0]} receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>

            <Text
                position={[0, -2.5, 0]}
                fontSize={0.15}
                color="#1A1A1A"
                anchorX="center"
                anchorY="middle"
            >
                {name}
            </Text>
            <Text
                position={[0, -2.7, 0]}
                fontSize={0.1}
                color="#707070"
                anchorX="center"
                anchorY="middle"
            >
                {artist}
            </Text>
        </group>
    )
}

export default function Gallery3D() {
    return (
        <div className="h-screen w-full bg-luxury-cream">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Suspense fallback={null}>
                    {/* Ghana Art Exhibition */}
                    <ArtPedestal position={[-4, 0.5, -2]} name="Spirit of Accra" artist="Amara K." image="/images/art-1.png" />
                    <ArtPedestal position={[0, 0.5, 0]} name="Fluid Harmony" artist="Kofi B." image="/images/art-2.png" />
                    <ArtPedestal position={[4, 0.5, -2]} name="Makola Rhythms" artist="Kwame A." image="/images/MAKOLA.jpg" />

                    <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
                    <Environment preset="studio" />
                </Suspense>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-luxury-gray text-[10px] uppercase tracking-[0.4em] mb-2 font-medium">Drag to orbit • Scroll to zoom</p>
                <div className="w-[1px] h-12 bg-luxury-gold mx-auto animate-pulse" />
            </div>
        </div>
    )
}
