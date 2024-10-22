'use client'

import { useRef, useMemo, ReactNode } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { Canvas, useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
extend({ Line_: THREE.Line })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
    }
  }
}

interface HeroProps {
  children: ReactNode;
}

const createSphereNodes = (numNodes: number, radius: number) => {
  const nodes = []
  for (let i = 0; i < numNodes; i++) {
    const theta = Math.random() * Math.PI * 2 // Random angle theta
    const phi = Math.acos((Math.random() * 2) - 1) // Random angle phi
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)
    nodes.push([x, y, z])
  }
  return nodes
}

// const WavyLines = () => {
//   const { offset } = useSpring({
//     from: { offset: 0 },
//     to: { offset: 1 },
//     config: { duration: 2000 },
//     loop: true,
//   })

//   const createPath = (startY: number, amplitude: number, frequency: number) => {
//     const points = []
//     for (let x = 0; x <= 1000; x += 5) {
//       const y = startY + amplitude * Math.sin((x / 1000) * Math.PI * frequency)
//       points.push(`${x},${y}`)
//     }
//     return `M${points.join(' L')}`
//   }

//   return (
//     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
//       <animated.path
//         d={createPath(100, 50, 2)}
//         stroke="#3b82f6"
//         strokeWidth="2"
//         fill="none"
//         strokeDasharray="5000"
//         strokeDashoffset={offset.to(o => 5000 - o * 5000)}
//       />
//       <animated.path
//         d={createPath(200, 40, 3)}
//         stroke="#8b5cf6"
//         strokeWidth="2"
//         fill="none"
//         strokeDasharray="5000"
//         strokeDashoffset={offset.to(o => 5000 - o * 5000)}
//       />
//       <animated.path
//         d={createPath(300, 60, 1.5)}
//         stroke="#ec4899"
//         strokeWidth="2"
//         fill="none"
//         strokeDasharray="5000"
//         strokeDashoffset={offset.to(o => 5000 - o * 5000)}
//       />
//     </svg>
//   )
// }

const Node = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.05, 32, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
)

const Edge = ({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) => {
  const ref = useRef<THREE.Line>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.geometry.setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
      ])
    }
  })

  return (
    <line_ ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line_>
  )
}

const GlobeGraph = () => {
  const numNodes = 100 // Adjust number of nodes to reduce by 1/3
  const radius = 3 // Radius of the globe
  const nodes = useMemo(() => createSphereNodes(numNodes, radius), [])

  // Create edges only between nearby nodes
  const edges = useMemo(() => {
    const temp = []
    const maxDistance = radius * 0.4 // Only connect adjacent nodes within a certain distance
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = new THREE.Vector3(...nodes[i]).distanceTo(new THREE.Vector3(...nodes[j]))
        if (distance <= maxDistance) {
          temp.push([i, j]) // Create an edge only if nodes are close
        }
      }
    }
    return temp
  }, [nodes])

  const colors = ['#ffffff', '#000000']

  const globeRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={globeRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos as [number, number, number]} color={colors[i % 2]} />
      ))}
      {edges.map(([start, end], i) => (
        <Edge key={i} start={nodes[start] as [number, number, number]} end={nodes[end] as [number, number, number]} color={colors[i % 2]} />
      ))}
    </group>
  )
}


export default function Hero({ children }: HeroProps) {  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 4], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <GlobeGraph />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}