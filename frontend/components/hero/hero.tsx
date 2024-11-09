// components/hero/Hero.tsx
'use client';

import React, { useEffect, useRef, MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import GlobeGraph from '@/components/hero/globe-graph';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import MockGraphVisualization from './mock-graph-visualization';
import { GitHubRepoForm } from '../github-repo-form';

const Hero: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(
    null
  ) as MutableRefObject<THREE.PerspectiveCamera | null>;

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);

    const maxScroll = 500; // Adjust based on desired scroll length
    const initialZ = 4; // Camera initial position.z
    const minZ = initialZ / 2; // Minimum z (zoomed in)
    const maxZ = initialZ; // Maximum z (initial position)

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Calculate scroll factor (0 to 1)
      const scrollFactor = Math.min(scrollY / maxScroll, 1);

      // Calculate new camera z position
      const newZ = maxZ - scrollFactor * (maxZ - minZ);

      if (cameraRef.current) {
        cameraRef.current.position.z = newZ;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative overflow-visible">
      {/* Fixed globe container */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          className="w-full h-full"
          onCreated={({ camera }) => {
            cameraRef.current = camera as THREE.PerspectiveCamera;
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GlobeGraph />
          <OrbitControls
            enableZoom={false} // Disable manual zooming
            enableRotate={false}
            enableDamping={true}
            dampingFactor={0.1}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* Content that scrolls over the globe */}
      <div className="relative z-10">
        {/* Your content goes here */}
        {/* Ensure there's enough content to allow scrolling */}
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-sky-400 to-purple-400">
              Ephisto
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Your copilot for navigating complex codebases.
          </p>
          <GitHubRepoForm />
        </div>
        {/* Additional content */}
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          {/* More content to scroll into */}
          <MockGraphVisualization />
        </div>
      </div>
    </div>
  );
};

export default Hero;