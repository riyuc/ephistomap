'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Node from '@/components/hero/node';
import Edge from '@/components/hero/edge';

const createSphereNodes = (numNodes: number, radius: number): [number, number, number][] => {
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < numNodes; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    nodes.push([x, y, z]);
  }
  return nodes;
};

const GlobeGraph: React.FC = () => {
  const numNodes = 100;
  const radius = 3;
  const nodes = useMemo(() => createSphereNodes(numNodes, radius), [numNodes, radius]);

  const edges = useMemo(() => {
    const temp: [number, number][] = [];
    const maxDistance = radius * 0.4;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = new THREE.Vector3(...nodes[i]).distanceTo(new THREE.Vector3(...nodes[j]));
        if (distance <= maxDistance) {
          temp.push([i, j]);
        }
      }
    }
    return temp;
  }, [nodes, radius]);

  const nodeColor = '#1E40AF'; // Dark blue for nodes
  const edgeColor = '#93C5FD'; // Light blue for edges

  const globeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} color={nodeColor} />
      ))}
      {edges.map(([start, end], i) => (
        <Edge
          key={i}
          start={nodes[start]}
          end={nodes[end]}
          color={edgeColor}
        />
      ))}
    </group>
  );
};

export default GlobeGraph;
