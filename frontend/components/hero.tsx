'use client'

import { useRef, useMemo, ReactNode } from 'react'
import { Canvas, useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { AuroraBackground } from './ui/aurora-background'
import { GitHubRepoForm } from './github-repo-form'
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
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)
    nodes.push([x, y, z])
  }
  return nodes
}

const Node = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.01, 16, 16]} /> {/* Reduced size from 0.05 to 0.02 */}
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
      <lineBasicMaterial color={color} linewidth={1} />
    </line_>
  )
}

const GlobeGraph = () => {
  const numNodes = 100
  const radius = 3
  const nodes = useMemo(() => createSphereNodes(numNodes, radius), [])

  const edges = useMemo(() => {
    const temp = []
    const maxDistance = radius * 0.4
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = new THREE.Vector3(...nodes[i]).distanceTo(new THREE.Vector3(...nodes[j]))
        if (distance <= maxDistance) {
          temp.push([i, j])
        }
      }
    }
    return temp
  }, [nodes])

  const nodeColor = '#1E40AF' // Dark blue for nodes
  const edgeColor = '#93C5FD' // Light blue for edges

  const globeRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={globeRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos as [number, number, number]} color={nodeColor} />
      ))}
      {edges.map(([start, end], i) => (
        <Edge key={i} start={nodes[start] as [number, number, number]} end={nodes[end] as [number, number, number]} color={edgeColor} />
      ))}
    </group>
  )
}

export default function Hero() {
  return (
    <div className="relative h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground>
        {/* 3D Globe Graph Canvas */}
        <Canvas className="absolute inset-0" camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GlobeGraph />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
        {/* Text Container */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-black space-y-4">
            <h1 className="text-5xl font-bold">
              First day on the job?
            </h1>
            <h2 className="text-5xl bg-gradient-to-r from-pink-400 via-sky-400 to-purple-400 text-transparent bg-clip-text">
              Ephisto got you covered
            </h2>
            <p className="text-xl">
              Ephisto helps you navigate and understand complex codebases effortlessly.
            </p>
            <GitHubRepoForm />
          </div>
        </div>
      </AuroraBackground>
    </div>
  );
}