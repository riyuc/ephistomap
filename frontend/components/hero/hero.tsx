// components/hero/Hero.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GlobeGraph from '@/components/hero/globe-graph';
import MockGraphVisualization from '@/components/hero/mock-graph-visualization';

const Hero: React.FC = () => {
  const [zoom, setZoom] = useState(1); // Initial zoom level
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxZoomScroll = 500; // Maximum scroll offset for zooming
  const minZoomScroll = 0; // Minimum scroll offset (no zoom)

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const delta = event.deltaY;

      // Calculate potential new scroll position
      let newScrollPosition = scrollPosition + delta;

      // Clamp the new scroll position between minZoomScroll and maxZoomScroll
      newScrollPosition = Math.max(minZoomScroll, Math.min(newScrollPosition, maxZoomScroll));

      // Determine if scrolling should be prevented
      if (newScrollPosition !== scrollPosition) {
        event.preventDefault();

        setScrollPosition(newScrollPosition);

        // Calculate new zoom level based on scroll position
        const newZoom = 1 + newScrollPosition / maxZoomScroll; // Zoom ranges from 1 to 2
        setZoom(newZoom);
      }
      // No else block needed; normal scrolling behavior resumes when outside zoom range
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [scrollPosition]);

  // Calculate dynamic opacity and translateY based on scrollPosition
  const fadeInRatio = Math.min(scrollPosition / maxZoomScroll, 1); // Ensures the ratio doesn't exceed 1
  const opacity = fadeInRatio; // Opacity ranges from 0 to 1
  const translateY = 10 - fadeInRatio * 10; // TranslateY ranges from 10px to 0px

  return (
    <div className="relative overflow-visible">
      {/* Fixed globe container */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GlobeGraph zoom={zoom} />
        </Canvas>
      </div>

      {/* Content that scrolls over the globe */}
      <div ref={contentRef} className="relative z-10">
        {/* Spacer to push content below the viewport initially */}
        <div className="h-screen"></div>

        {/* Landing page content with two sections: Text and Visualization */}
        <div
          className="min-h-screen flex flex-col md:flex-row items-center justify-center transition-opacity transition-transform ease-in-out duration-700"
          style={{
            opacity: opacity,
            transform: `translateY(${translateY}px)`,
            pointerEvents: opacity > 0 ? 'auto' : 'none', // Enable interactions only when visible
          }}
        >
          {/* Left Section: Welcome Text */}
          <div className="w-full md:w-1/2 p-6">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
              Welcome to Ephisto
            </h1>
            <p className="text-xl text-gray-600">
              Your copilot for navigating complex codebases.
            </p>
            {/* Add more descriptive text or buttons as needed */}
          </div>

          {/* Right Section: Graph Visualization */}
          <div className="w-full md:w-1/2 p-6">
            <MockGraphVisualization />
          </div>
        </div>

        {/* Additional content sections */}
      </div>
    </div>
  );
};

export default Hero;