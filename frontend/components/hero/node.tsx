'use client';

import React from 'react';
import { MeshProps } from '@react-three/fiber';

interface NodeProps extends MeshProps {
  color: string;
}

const Node: React.FC<NodeProps> = ({ position, color }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.01, 16, 16]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export default Node;
