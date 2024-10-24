// components/hero/Hero.tsx
'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AuroraBackground } from '../ui/aurora-background';
import GlobeGraph from '@/components/hero/globe-graph';
import { GitHubRepoForm } from '../github-repo-form';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground>
        {/* 3D Globe Graph Canvas */}
        <Canvas className="absolute inset-0" camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GlobeGraph />
          <OrbitControls enableZoom enablePan />
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
};

export default Hero;
