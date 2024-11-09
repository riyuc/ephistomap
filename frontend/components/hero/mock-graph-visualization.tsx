'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const MockGraphVisualization: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Define the graph structure
  const nodes = [
    { id: 'A', x: 300, y: 300, level: 0 }, // Central node
    { id: 'B', x: 273, y: 180, level: 1 },
    { id: 'C', x: 225, y: 270, level: 1 },
    { id: 'D', x: 391, y: 271, level: 1 },
    { id: 'E', x: 402, y: 350, level: 1 },
    { id: 'F', x: 250, y: 400, level: 1 },
    { id: 'G', x: 150, y: 200, level: 2 },
    { id: 'H', x: 150, y: 300, level: 2 },
    { id: 'I', x: 150, y: 400, level: 2 },
    { id: 'J', x: 450, y: 200, level: 2 },
    { id: 'K', x: 450, y: 300, level: 2 },
    { id: 'L', x: 450, y: 400, level: 2 },
    { id: 'M', x: 300, y: 150, level: 2 },
    { id: 'N', x: 300, y: 450, level: 2 },
    { id: 'O', x: 200, y: 150, level: 2 },
    { id: 'P', x: 200, y: 450, level: 2 },
    { id: 'Q', x: 400, y: 150, level: 2 },
    { id: 'R', x: 400, y: 450, level: 2 },

  ];

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'A', to: 'E' },
    { from: 'A', to: 'F' },
    { from: 'B', to: 'M' },
    { from: 'B', to: 'O' },
    { from: 'C', to: 'G' },
    { from: 'C', to: 'H' },
    { from: 'C', to: 'I' },
    { from: 'D', to: 'J' },
    { from: 'D', to: 'K' },
    { from: 'D', to: 'L' },
    { from: 'F', to: 'N' },
    { from: 'F', to: 'P' },
    { from: 'E', to: 'R' },
  ];

  // Map node IDs to node data for easy access
  const nodeMap = nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {} as Record<string, typeof nodes[0]>);

  // Variant for nodes
  const nodeVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: any) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom.level * 0.5,
        duration: 0.5,
      },
    }),
  };

  // Variant for edges
  const edgeVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: any) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: custom.level * 0.5 + 0.25, // Slight delay after node
        duration: 0.5,
      },
    }),
  };

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <motion.svg
        height={600}
        width={600}
        viewBox="0 0 600 600"
        initial="hidden"
        animate={controls}
      >
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromNode = nodeMap[edge.from];
          const toNode = nodeMap[edge.to];
          const edgeLevel = Math.max(fromNode.level, toNode.level);

          return (
            <motion.line
              key={`edge-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#0a6190"
              strokeWidth="2"
              custom={{ level: edgeLevel }}
              variants={edgeVariant}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r="10"
            stroke="#0a6190"
            fill="#0a6190"
            custom={{ level: node.level }}
            variants={nodeVariant}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default MockGraphVisualization;