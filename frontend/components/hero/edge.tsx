'use client';

import React, { useRef } from 'react';
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

extend({ Line_: THREE.Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>;
    }
  }
}

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

const Edge: React.FC<EdgeProps> = ({ start, end, color }) => {
  const ref = useRef<THREE.Line>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.geometry.setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
      ]);
    }
  });

  return (
    <line_ ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} linewidth={1} />
    </line_>
  );
};

export default Edge;
