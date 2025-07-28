"use client"

import { useRef, useMemo } from "react" // Import useMemo
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function AnimatedPoints() {
  const ref = useRef<THREE.Points>(null!)

  // Generate sphere data using useMemo to ensure it runs only on the client
  const sphere = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)
      const x = Math.cos(theta) * Math.cos(phi) * Math.random() * 10
      const y = Math.sin(theta) * Math.random() * 10
      const z = Math.cos(theta) * Math.sin(phi) * Math.random() * 10
      positions.set([x, y, z], i * 3)
    }
    return positions
  }, []) // Empty dependency array means it runs once on mount

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }} style={{ background: "transparent" }}>
        <AnimatedPoints />
      </Canvas>
    </div>
  )
}
